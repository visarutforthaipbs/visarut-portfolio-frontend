<?php
/**
 * WP-PostViews Integration for REST API
 * Add this to your theme's functions.php file or as a custom plugin
 */

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
    if (function_exists('the_views')) {
        // Get views using WP-PostViews function
        $views = get_post_meta($post_id, 'views', true);
        return $views ? intval($views) : 0;
    }
    
    // Fallback: try to get from post meta directly
    $views = get_post_meta($post_id, 'views', true);
    if (!$views) {
        $views = get_post_meta($post_id, 'post_views', true);
    }
    
    return $views ? intval($views) : 0;
}

// Enable CORS for the WP-PostViews AJAX endpoint
add_action('wp_ajax_nopriv_postviews', 'handle_postviews_cors');
add_action('wp_ajax_postviews', 'handle_postviews_cors');

function handle_postviews_cors() {
    // Add CORS headers
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
    
    // Let WP-PostViews handle the actual view tracking
    if (function_exists('process_postviews')) {
        process_postviews();
    } else {
        // Fallback: manual view tracking
        $post_id = intval($_POST['postviews_id']);
        if ($post_id > 0) {
            $current_views = get_post_meta($post_id, 'views', true);
            $current_views = $current_views ? intval($current_views) : 0;
            update_post_meta($post_id, 'views', $current_views + 1);
            
            wp_die('1'); // WP-PostViews typically returns '1' for success
        }
    }
}

// Optional: Add view count to post meta in REST API
add_action('rest_api_init', function() {
    register_rest_field('post', 'post_views', array(
        'get_callback' => function($object) {
            return get_post_meta($object['id'], 'views', true) ?: '0';
        },
        'schema' => array(
            'type' => 'string',
            'description' => 'Post views as string (WP-PostViews format)'
        )
    ));
});

// Ensure WP-PostViews tracking works with REST API requests
add_action('init', function() {
    // Allow tracking from external origins
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        }
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        }
        
        exit(0);
    }
});

// Optional: Debug function to check if views are being tracked
function debug_post_views($post_id) {
    $views = get_post_meta($post_id, 'views', true);
    error_log("Post {$post_id} has {$views} views");
    return $views;
}

// Initialize view counts for existing posts (run once)
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
    
    error_log('Initialized WP-PostViews for ' . count($posts) . ' posts');
}

// Uncomment to initialize existing posts with view counts
// add_action('admin_init', 'initialize_wp_postviews_for_existing_posts');

?>
