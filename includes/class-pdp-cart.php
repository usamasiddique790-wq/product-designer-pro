<?php
/**
 * Cart functionality.
 *
 * @package ProductDesignerPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * PDP Cart class.
 */
class PDP_Cart {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter(
			'woocommerce_add_cart_item_data',
			array( $this, 'add_design_to_cart_item' ),
			10,
			2
		);

		add_filter(
			'woocommerce_get_item_data',
			array( $this, 'display_design_in_cart' ),
			10,
			2
		);
	}

	/**
	 * Save design JSON into cart item.
	 *
	 * @param array $cart_item_data Cart item.
	 * @param int   $product_id Product ID.
	 *
	 * @return array
	 */
	public function add_design_to_cart_item( $cart_item_data, $product_id ) {

		unset( $product_id );

		if ( empty( $_POST['pdp_design_json'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
			return $cart_item_data;
		}

		$design_json = wp_unslash( $_POST['pdp_design_json'] ); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		$cart_item_data['pdp_design_json'] = $design_json;
		$cart_item_data['pdp_unique_key']  = md5( microtime() . wp_rand() );

		return $cart_item_data;
	}

	/**
	 * Show design in cart.
	 *
	 * @param array $item_data Item data.
	 * @param array $cart_item Cart item.
	 *
	 * @return array
	 */
	public function display_design_in_cart( $item_data, $cart_item ) {

		if ( empty( $cart_item['pdp_design_json'] ) ) {
			return $item_data;
		}

		$item_data[] = array(
			'name'  => esc_html__( 'Custom Design', 'product-designer-pro' ),
			'value' => esc_html__( 'Included', 'product-designer-pro' ),
		);

		return $item_data;
	}
}
