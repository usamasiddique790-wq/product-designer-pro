<?php
/**
 * Plugin Name: Product Designer Pro
 * Description: Professional WooCommerce product designer plugin.
 * Version: 1.0.0
 * Author: Usama Siddique
 *
 * @package ProductDesignerPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PDP_VERSION', '1.0.0' );
if ( function_exists( 'plugin_dir_path' ) ) {
	define( 'PDP_PATH', plugin_dir_path( __FILE__ ) );
} else {
	define( 'PDP_PATH', __DIR__ . '/' );
}
if ( function_exists( 'plugin_dir_url' ) ) {
	define( 'PDP_URL', plugin_dir_url( __FILE__ ) );
} else {
	define( 'PDP_URL', '' );
}

require_once PDP_PATH . 'includes/class-product-designer-pro.php';

register_activation_hook( __FILE__, array( 'Product_Designer_Pro', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'Product_Designer_Pro', 'deactivate' ) );
if ( function_exists( 'add_action' ) ) {
	add_action(
		'plugins_loaded',
		function () {
			Product_Designer_Pro::instance();
		}
	);
}
