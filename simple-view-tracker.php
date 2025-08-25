<?php
/**
 * Simple View Tracking Plugin for WordPress (Standalone)
 * Plugin Name: Simple Post View Tracker
 * Description: Simple view tracking without external dependencies
 * Version: 1.0.0
 * Author: Visarut Sankham
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Add view count field to REST API response for posts
add_action('rest_api_init', function() {
    register_rest_field('post', 'views', array(
        'get_callback' => 'get_simple_post_views',
        'update_callback' => null,
        'schema' => array(
            'type' => 'integer',
            'description' => 'Number of views for this post',
            'context' => array('view', 'edit')
        )
    ));
});

// Get post views
function get_simple_post_views($object, $field_name, $request) {
    $post_id = $object['id'];
    $views = get_post_meta($post_id, 'simple_post_views', true);
    return $views ? intval($views) : 0;
}

// Create REST endpoint for tracking views
add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/posts/(?P<id>\d+)/track-view', array(
        'methods' => 'POST',
        'callback' => 'track_simple_post_view',
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

// Track post view function
function track_simple_post_view($request) {
    $post_id = $request['id'];
    
    // Verify post exists
    $post = get_post($post_id);
    if (!$post || $post->post_status !== 'publish') {
        return new WP_Error('post_not_found', 'Post not found', array('status' => 404));
    }
    
    // Get current view count
    $current_views = get_post_meta($post_id, 'simple_post_views', true);
    $current_views = $current_views ? intval($current_views) : 0;
    
    // Increment view count
    $new_views = $current_views + 1;
    update_post_meta($post_id, 'simple_post_views', $new_views);
    
    // Also update 'views' field for compatibility
    update_post_meta($post_id, 'views', $new_views);
    
    // Log for debugging
    error_log("Simple view tracking: Post {$post_id} now has {$new_views} views");
    
    return array(
        'success' => true,
        'post_id' => $post_id,
        'views' => $new_views,
        'message' => 'View tracked successfully'
    );
}

// Enable CORS
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        
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

// Add admin column to show view counts
add_filter('manage_posts_columns', 'add_simple_views_column');
add_action('manage_posts_custom_column', 'show_simple_views_column', 10, 2);

function add_simple_views_column($columns) {
    $columns['simple_views'] = 'Views';
    return $columns;
}

function show_simple_views_column($column, $post_id) {
    if ($column === 'simple_views') {
        $views = get_post_meta($post_id, 'simple_post_views', true);
        echo $views ? intval($views) : 0;
    }
}

// Initialize existing posts with 0 views (run once)
register_activation_hook(__FILE__, 'initialize_simple_view_counts');

function initialize_simple_view_counts() {
    $posts = get_posts(array(
        'numberposts' => -1,
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => 'simple_post_views',
                'compare' => 'NOT EXISTS'
            )
        )
    ));
    
    foreach ($posts as $post) {
        update_post_meta($post->ID, 'simple_post_views', 0);
        update_post_meta($post->ID, 'views', 0);
    }
}

// Admin page for viewing stats
add_action('admin_menu', function() {
    add_options_page(
        'Simple View Tracker',
        'View Tracker',
        'manage_options',
        'simple-view-tracker',
        'simple_view_tracker_admin_page'
    );
});

function simple_view_tracker_admin_page() {
    // Get most viewed posts
    $popular_posts = get_posts(array(
        'numberposts' => 10,
        'meta_key' => 'simple_post_views',
        'orderby' => 'meta_value_num',
        'order' => 'DESC',
        'meta_query' => array(
            array(
                'key' => 'simple_post_views',
                'value' => 0,
                'compare' => '>'
            )
        )
    ));
    
    ?>
    <div class="wrap">
        <h1>Simple View Tracker</h1>
        
        <div class="card">
            <h2>Most Popular Posts</h2>
            <?php if ($popular_posts): ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Post Title</th>
                            <th>Views</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($popular_posts as $post): ?>
                            <tr>
                                <td>
                                    <a href="<?php echo get_edit_post_link($post->ID); ?>">
                                        <?php echo esc_html($post->post_title); ?>
                                    </a>
                                </td>
                                <td>
                                    <?php echo get_post_meta($post->ID, 'simple_post_views', true) ?: 0; ?>
                                </td>
                                <td>
                                    <?php echo get_the_date('Y-m-d', $post->ID); ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p>No views recorded yet. Views will appear here once people start reading your posts!</p>
            <?php endif; ?>
        </div>
        
        <div class="card">
            <h2>API Test</h2>
            <p>Test the tracking endpoint:</p>
            <pre>POST <?php echo rest_url('wp/v2/posts/6847/track-view'); ?></pre>
            <p>This should increment the view count for post ID 6847.</p>
        </div>
    </div>
    <?php
}

?>
