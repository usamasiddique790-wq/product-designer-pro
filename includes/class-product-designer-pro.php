<?php
/**
 * Main plugin class.
 *
 * @package ProductDesignerPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once PDP_PATH . 'includes/class-product-designer-woocommerce.php';

require_once PDP_PATH . 'includes/class-pdp-product.php';
require_once PDP_PATH . 'includes/class-pdp-cart.php';
require_once PDP_PATH . 'includes/class-pdp-order.php';

require_once PDP_PATH . 'public/class-product-designer-public.php';

/**
 * Main Product Designer Pro class.
 */
class Product_Designer_Pro {

	/**
	 * Plugin instance.
	 *
	 * @var Product_Designer_Pro|null
	 */
	private static $instance = null;

	/**
	 * Get plugin instance.
	 *
	 * @return Product_Designer_Pro
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {

		// Frontend.
		new Product_Designer_Public();

		// WooCommerce integration.
		if ( class_exists( 'WooCommerce' ) ) {
			new Product_Designer_WooCommerce();
		}
	}

	/**
	 * Plugin activation hook.
	 *
	 * @return void
	 */
	public static function activate() {
		// Future activation tasks.
	}

	/**
	 * Plugin deactivation hook.
	 *
	 * @return void
	 */
	public static function deactivate() {
		// Future deactivation tasks.
	}
}
