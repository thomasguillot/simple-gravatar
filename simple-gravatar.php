<?php
/**
 * Plugin Name: Simple Gravatar
 * Description: A simple block to display Gravatar images
 * Version: 1.0.0
 * Author: Thomas Guillot
 * Author URI: https://thomasguillot.com/
 * Text Domain: simple-gravatar
 * Domain Path: /languages
 *
 * @package Simple_Gravatar
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Load translations.
/**
 * Load plugin text domain.
 */
function simple_gravatar_load_textdomain() {
	load_plugin_textdomain( 'simple-gravatar', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'simple_gravatar_load_textdomain' );

/**
 * Register the block.
 */
function create_simple_gravatar_block() {
	register_block_type(
		__DIR__ . '/dist',
		array(
			'render_callback' => 'render_simple_gravatar_block',
		)
	);
}
add_action( 'init', 'create_simple_gravatar_block' );

/**
 * Render the block on the front-end.
 *
 * @param array $attributes Block attributes.
 * @return string Block content.
 */
function render_simple_gravatar_block( $attributes ) {
	$email = $attributes['email'] ?? '';
	$size  = $attributes['size'] ?? 72;

	if ( empty( $email ) ) {
		return '';
	}

	$hash         = hash( 'sha256', strtolower( trim( $email ) ) );
	$gravatar_url = sprintf(
		'https://www.gravatar.com/avatar/%s?s=%d&default=mp',
		$hash,
		$size * 2 // For retina displays.
	);

	// Fetch profile name from Gravatar.
	$profile_name = '';
	$profile_url  = sprintf( 'https://www.gravatar.com/%s.json', $hash );
	$response     = wp_safe_remote_get( $profile_url );

	if ( ! is_wp_error( $response ) && 200 === wp_remote_retrieve_response_code( $response ) ) {
		$body = wp_remote_retrieve_body( $response );
		$data = json_decode( $body );
		if ( ! empty( $data->entry[0]->displayName ) ) {
			$profile_name = $data->entry[0]->displayName;
		}
	}

	if ( ! empty( $profile_name ) ) {
		// translators: %s: The name of the person whose Gravatar is being displayed.
		$alt_text = sprintf( __( 'Avatar for %s', 'simple-gravatar' ), $profile_name );
	} else {
		$alt_text = __( 'User avatar', 'simple-gravatar' );
	}

	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'style' => sprintf( 'width: %dpx; height: %dpx;', $size, $size ),
		)
	);

	return sprintf(
		'<div %s><img src="%s" alt="%s" width="%d" height="%d"></div>',
		$wrapper_attributes,
		esc_url( $gravatar_url ),
		esc_attr( $alt_text ),
		$size,
		$size
	);
}
