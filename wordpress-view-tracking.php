<?php
/**
 * Blog Post View Tracking for WordPress
 * Add this to your theme's functions.php file or as a custom plugin
 */

// Add view count field to REST API response
add_action('rest_api_init', function() {
    // Add views field to posts endpoint
    register_rest_field('post', 'views', array(
        'get_callback' => 'get_post_views_for_api',
        'update_callback' => null,
        'schema' => array(
            'type' => 'integer',
            'description' => 'Number of views for this post',
            'context' => array('view', 'edit')
        )
    ));
});

// Get post views for API response
function get_post_views_for_api($object, $field_name, $request) {
    $post_id = $object['id'];
    $views = get_post_meta($post_id, 'post_views', true);
    return $views ? intval($views) : 0;
}

// Create custom endpoint for tracking views
add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/posts/(?P<id>\d+)/view', array(
        'methods' => 'POST',
        'callback' => 'track_post_view',
        'permission_callback' => '__return_true', // Allow public access
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
function track_post_view($request) {
    $post_id = $request['id'];
    
    // Verify post exists
    $post = get_post($post_id);
    if (!$post || $post->post_status !== 'publish') {
        return new WP_Error('post_not_found', 'Post not found', array('status' => 404));
    }
    
    // Get current view count
    $current_views = get_post_meta($post_id, 'post_views', true);
    $current_views = $current_views ? intval($current_views) : 0;
    
    // Increment view count
    $new_views = $current_views + 1;
    update_post_meta($post_id, 'post_views', $new_views);
    
    // Log for debugging (optional)
    error_log("Post {$post_id} view tracked. New count: {$new_views}");
    
    return array(
        'success' => true,
        'post_id' => $post_id,
        'views' => $new_views,
        'message' => 'View tracked successfully'
    );
}

// Add CORS headers for the custom endpoint
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
});

// Optional: Add view count to admin columns
add_filter('manage_posts_columns', 'add_views_column');
add_action('manage_posts_custom_column', 'show_views_column', 10, 2);

function add_views_column($columns) {
    $columns['post_views'] = 'Views';
    return $columns;
}

function show_views_column($column, $post_id) {
    if ($column === 'post_views') {
        $views = get_post_meta($post_id, 'post_views', true);
        echo $views ? intval($views) : 0;
    }
}

// Optional: Make views column sortable
add_filter('manage_edit-post_sortable_columns', 'make_views_column_sortable');

function make_views_column_sortable($columns) {
    $columns['post_views'] = 'post_views';
    return $columns;
}

// Handle sorting by views
add_action('pre_get_posts', 'sort_posts_by_views');

function sort_posts_by_views($query) {
    if (!is_admin() || !$query->is_main_query()) {
        return;
    }
    
    if ($query->get('orderby') === 'post_views') {
        $query->set('meta_key', 'post_views');
        $query->set('orderby', 'meta_value_num');
    }
}

// Optional: Initialize view count for existing posts
function initialize_view_counts_for_existing_posts() {
    $posts = get_posts(array(
        'numberposts' => -1,
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => 'post_views',
                'compare' => 'NOT EXISTS'
            )
        )
    ));
    
    foreach ($posts as $post) {
        update_post_meta($post->ID, 'post_views', 0);
    }
    
    error_log('Initialized view counts for ' . count($posts) . ' posts');
}

// Uncomment the line below to run initialization once
// add_action('admin_init', 'initialize_view_counts_for_existing_posts');

?>
