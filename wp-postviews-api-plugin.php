<?php
/**
 * Plugin Name: WP-PostViews REST API Integration
 * Plugin URI: https://visarutsankham.com
 * Description: Integrates WP-PostViews with REST API for Next.js frontend
 * Version: 1.0.0
 * Author: Visarut Sankham
 * License: GPL v2 or later
 * Text Domain: wp-postviews-api
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin activation hook
register_activation_hook(__FILE__, 'wp_postviews_api_activate');
function wp_postviews_api_activate() {
    // Check if WP-PostViews is active
    if (!is_plugin_active('wp-postviews/wp-postviews.php')) {
        wp_die('This plugin requires WP-PostViews to be installed and activated.');
    }
}

// Add view count field to REST API response for posts
add_action('rest_api_init', function() {
    register_rest_field('post', 'views', array(
        'get_callback' => 'get_post_views_for_api',
        'update_callback' => null,
        'schema' => array(
            'type' => 'integer',
            'description' => 'Number of views for this post (WP-PostViews)',
            'context' => array('view', 'edit')
        )
    ));
});

// Get post views for API response using WP-PostViews functions
function get_post_views_for_api($object, $field_name, $request) {
    $post_id = $object['id'];
    
    // Check if WP-PostViews functions exist
    if (function_exists('get_post_views')) {
        return intval(get_post_views($post_id));
    }
    
    // Fallback: try to get from post meta directly
    $views = get_post_meta($post_id, 'views', true);
    if (!$views) {
        $views = get_post_meta($post_id, 'post_views', true);
    }
    
    return $views ? intval($views) : 0;
}

// Create custom REST endpoint for view tracking
add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/posts/(?P<id>\d+)/track-view', array(
        'methods' => 'POST',
        'callback' => 'track_post_view_rest',
        'permission_callback' => '__return_true',
        'args' => array(
            'id' => array(
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
        ),
    ));
});

// REST endpoint callback for view tracking
function track_post_view_rest($request) {
    $post_id = $request['id'];
    
    // Verify post exists
    $post = get_post($post_id);
    if (!$post || $post->post_status !== 'publish') {
        return new WP_Error('post_not_found', 'Post not found', array('status' => 404));
    }
    
    // Track view using WP-PostViews if available
    if (function_exists('process_postviews')) {
        // Simulate the $_GET parameter that WP-PostViews expects
        $_GET['p'] = $post_id;
        process_postviews();
    } else {
        // Fallback: manual increment
        $current_views = get_post_meta($post_id, 'views', true);
        $current_views = $current_views ? intval($current_views) : 0;
        update_post_meta($post_id, 'views', $current_views + 1);
    }
    
    // Get updated view count
    $new_views = get_post_views_for_api(array('id' => $post_id), 'views', $request);
    
    return array(
        'success' => true,
        'post_id' => $post_id,
        'views' => $new_views,
        'message' => 'View tracked successfully'
    );
}

// Enable CORS for REST API endpoints
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        
        // Allow specific origins or all origins for development
        $allowed_origins = array(
            'http://localhost:3000',
            'https://visarutsankham.com',
            'https://www.visarutsankham.com'
        );
        
        if (in_array($origin, $allowed_origins) || !$origin) {
            header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
        }
        
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        
        return $value;
    });
});

// Handle preflight OPTIONS requests
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        $origin = get_http_origin();
        
        $allowed_origins = array(
            'http://localhost:3000',
            'https://visarutsankham.com',
            'https://www.visarutsankham.com'
        );
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
            header('Access-Control-Max-Age: 86400');
        }
        
        http_response_code(200);
        exit();
    }
});

// Add post_views field to REST API response as well
add_action('rest_api_init', function() {
    register_rest_field('post', 'post_views', array(
        'get_callback' => function($object) {
            $views = get_post_views_for_api($object, 'views', null);
            return strval($views);
        },
        'schema' => array(
            'type' => 'string',
            'description' => 'Post views as string (WP-PostViews format)'
        )
    ));
});

// Optional: Add admin notice if WP-PostViews is not active
add_action('admin_notices', function() {
    if (!is_plugin_active('wp-postviews/wp-postviews.php')) {
        echo '<div class="notice notice-warning is-dismissible">';
        echo '<p><strong>WP-PostViews REST API Integration:</strong> This plugin requires WP-PostViews to be installed and activated.</p>';
        echo '</div>';
    }
});

// Optional: Initialize view counts for existing posts
function initialize_wp_postviews_for_existing_posts() {
    $posts = get_posts(array(
        'numberposts' => -1,
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => 'views',
                'compare' => 'NOT EXISTS'
            )
        )
    ));
    
    foreach ($posts as $post) {
        update_post_meta($post->ID, 'views', 0);
    }
    
    update_option('wp_postviews_api_initialized', true);
    
    return count($posts);
}

// Admin page for plugin settings
add_action('admin_menu', function() {
    add_options_page(
        'WP-PostViews API Settings',
        'PostViews API',
        'manage_options',
        'wp-postviews-api',
        'wp_postviews_api_admin_page'
    );
});

function wp_postviews_api_admin_page() {
    if (isset($_POST['initialize_posts'])) {
        $count = initialize_wp_postviews_for_existing_posts();
        echo '<div class="notice notice-success"><p>Initialized view counts for ' . $count . ' posts.</p></div>';
    }
    
    ?>
    <div class="wrap">
        <h1>WP-PostViews REST API Integration</h1>
        
        <div class="card">
            <h2>Plugin Status</h2>
            <p><strong>WP-PostViews Status:</strong> 
                <?php echo is_plugin_active('wp-postviews/wp-postviews.php') ? 
                    '<span style="color: green;">✅ Active</span>' : 
                    '<span style="color: red;">❌ Not Active</span>'; ?>
            </p>
            
            <p><strong>REST API Endpoint:</strong> 
                <code><?php echo rest_url('wp/v2/posts/{id}/track-view'); ?></code>
            </p>
        </div>
        
        <div class="card">
            <h2>Initialize Existing Posts</h2>
            <p>If you have existing posts without view counts, click the button below to initialize them with 0 views.</p>
            <form method="post">
                <?php wp_nonce_field('wp_postviews_api_init'); ?>
                <input type="submit" name="initialize_posts" class="button button-primary" 
                       value="Initialize View Counts for Existing Posts" 
                       onclick="return confirm('This will set view count to 0 for all posts that don\'t have a view count. Continue?');">
            </form>
        </div>
        
        <div class="card">
            <h2>Test API</h2>
            <p>You can test the API endpoint using:</p>
            <pre>
POST <?php echo rest_url('wp/v2/posts/1/track-view'); ?>
Content-Type: application/json
            </pre>
        </div>
    </div>
    <?php
}

// Add plugin action links
add_filter('plugin_action_links_' . plugin_basename(__FILE__), function($links) {
    $settings_link = '<a href="' . admin_url('options-general.php?page=wp-postviews-api') . '">Settings</a>';
    array_unshift($links, $settings_link);
    return $links;
});

?>
