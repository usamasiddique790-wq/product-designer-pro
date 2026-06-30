<?php
/**
 * Order integration.
 *
 * @package ProductDesignerPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class PDP_Order {

	public function __construct() {
		if ( function_exists( 'add_action' ) ) {
			add_action( 'woocommerce_after_order_itemmeta', array( $this, 'show_design_previews_admin' ), 10, 3 );
		}
	}

	public function show_design_previews_admin( $item_id, $item, $product ) {
		unset( $item_id, $product );

		if ( function_exists( 'is_admin' ) && ! call_user_func( 'is_admin' ) ) {
			return;
		}

		if ( ! is_object( $item ) || ! method_exists( $item, 'get_meta' ) ) {
			return;
		}

		$design_id = absint( $item->get_meta( '_pdp_design_id' ) );

		if ( ! $design_id ) {
			return;
		}

		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$design = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT preview_front, preview_back FROM wp_pdp_designs WHERE id = %d',
				$design_id
			)
		);

		if ( ! $design ) {
			return;
		}

		$preview_front = function_exists( 'esc_attr' ) ? call_user_func( 'esc_attr', $design->preview_front ) : $design->preview_front;
		$preview_back  = function_exists( 'esc_attr' ) ? call_user_func( 'esc_attr', $design->preview_back ) : $design->preview_back;
		$design_label  = function_exists( 'esc_html' ) ? call_user_func( 'esc_html', $design_id ) : $design_id;

		echo '<div class="pdp-admin-order-preview" style="margin-top:10px;">';
		echo '<strong>Product Design Preview</strong>';
		echo '<div style="display:flex; gap:12px; margin-top:8px; flex-wrap:wrap;">';

		if ( ! empty( $preview_front ) ) {
			echo '<div>';
			echo '<p style="margin:0 0 4px;"><strong>Front</strong></p>';
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<img src="' . $preview_front . '" style="max-width:160px;height:auto;border:1px solid #ddd;background:#fff;padding:4px;">';
			echo '</div>';
		}

		if ( ! empty( $preview_back ) ) {
			echo '<div>';
			echo '<p style="margin:0 0 4px;"><strong>Back</strong></p>';
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<img src="' . $preview_back . '" style="max-width:160px;height:auto;border:1px solid #ddd;background:#fff;padding:4px;">';
			echo '</div>';
		}

		echo '</div>';
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '<p style="margin-top:8px;">Design ID: ' . $design_label . '</p>';
		echo '</div>';
	}
}
