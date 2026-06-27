<?php
/**
 * Main plugin class.
 *
 * @package ProductDesignerPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once PDP_PATH . 'public/class-product-designer-public.php';
require_once PDP_PATH . 'includes/class-product-designer-woocommerce.php';

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
	 * Get instance.
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
		new Product_Designer_Public();

		if ( class_exists( 'WooCommerce' ) ) {
			new Product_Designer_WooCommerce();
		}
	}

	/**
	 * Activation hook.
	 *
	 * @return void
	 */
	public static function activate() {}

	/**
	 * Deactivation hook.
	 *
	 * @return void
	 */
	public static function deactivate() {}
}
