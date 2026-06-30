<?php
/**
 * Cart integration.
 *
 * @package ProductDesignerPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Product Designer cart integration.
 */
class PDP_Cart {

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( function_exists( 'add_filter' ) ) {
			add_filter( 'woocommerce_add_cart_item_data', array( $this, 'add_design_to_cart' ), 10, 3 );
			add_filter( 'woocommerce_get_item_data', array( $this, 'display_design_in_cart' ), 10, 2 );
		}

		if ( function_exists( 'add_action' ) ) {
			add_action( 'woocommerce_checkout_create_order_line_item', array( $this, 'save_design_to_order_item' ), 10, 4 );
		}
	}

	/**
	 * Add design ID to cart item.
	 *
	 * @param array $cart_item_data Cart item data.
	 * @param int   $product_id     Product ID.
	 * @param int   $variation_id   Variation ID.
	 *
	 * @return array
	 */
	public function add_design_to_cart( $cart_item_data, $product_id, $variation_id ) {
		unset( $product_id, $variation_id );

		if ( isset( $_POST['pdp_design_id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
			$design_id_raw = wp_unslash( $_POST['pdp_design_id'] ); // phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$design_id     = absint( $design_id_raw );

			if ( $design_id ) {
				$cart_item_data['pdp_design_id'] = $design_id;
				$cart_item_data['unique_key']    = md5( microtime() . wp_rand() );
			}
		}

		return $cart_item_data;
	}

	/**
	 * Display design ID in cart.
	 *
	 * @param array $item_data Cart display item data.
	 * @param array $cart_item Cart item.
	 *
	 * @return array
	 */
	public function display_design_in_cart( $item_data, $cart_item ) {
		if ( isset( $cart_item['pdp_design_id'] ) ) {
			$label = function_exists( '__' )
				? call_user_func( '__', 'Custom Design ID', 'product-designer-pro' )
				: 'Custom Design ID';

			$item_data[] = array(
				'name'  => $label,
				'value' => absint( $cart_item['pdp_design_id'] ),
			);
		}

		return $item_data;
	}

	/**
	 * Save design ID into order item meta.
	 *
	 * @param object $item          Order line item.
	 * @param string $cart_item_key Cart item key.
	 * @param array  $values        Cart item values.
	 * @param object $order         Order object.
	 *
	 * @return void
	 */
	public function save_design_to_order_item( $item, $cart_item_key, $values, $order ) {
		unset( $cart_item_key, $order );

		if ( isset( $values['pdp_design_id'] ) && is_object( $item ) && method_exists( $item, 'add_meta_data' ) ) {
			$item->add_meta_data(
				'_pdp_design_id',
				absint( $values['pdp_design_id'] ),
				true
			);
		}
	}
}
