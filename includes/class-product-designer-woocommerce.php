<?php
/**
 * WooCommerce coordinator.
 *
 * @package ProductDesignerPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Product Designer WooCommerce coordinator class.
 */
class Product_Designer_WooCommerce {

	/**
	 * Constructor.
	 */
	public function __construct() {
		new PDP_Product();
		new PDP_Cart();
		new PDP_Order();
	}
}
