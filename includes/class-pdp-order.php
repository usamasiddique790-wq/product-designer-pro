<?php
/**
 * Order functionality.
 *
 * @package ProductDesignerPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * PDP Order class.
 */
class PDP_Order {

	/**
	 * Constructor.
	 */
	public function __construct() {

		add_action(
			'woocommerce_checkout_create_order_line_item',
			array( $this, 'save_design_to_order_item' ),
			10,
			4
		);

		add_action(
			'woocommerce_after_order_itemmeta',
			array( $this, 'display_order_design_button' ),
			10,
			3
		);

		add_action(
			'admin_enqueue_scripts',
			array( $this, 'admin_assets' )
		);
	}

	/**
	 * Save design into order item.
	 *
	 * @param object $item Order item.
	 * @param string $cart_item_key Cart item key.
	 * @param array  $values Cart values.
	 * @param object $order Order.
	 *
	 * @return void
	 */
	public function save_design_to_order_item(
		$item,
		$cart_item_key,
		$values,
		$order
	) {

		unset( $cart_item_key, $order );

		if ( empty( $values['pdp_design_json'] ) ) {
			return;
		}

		$item->add_meta_data(
			'_pdp_design_json',
			(string) $values['pdp_design_json'],
			true
		);
	}

	/**
	 * Show View Design button.
	 *
	 * @param int    $item_id Item ID.
	 * @param object $item Order item.
	 * @param object $product Product.
	 *
	 * @return void
	 */
	public function display_order_design_button(
		$item_id,
		$item,
		$product
	) {

		unset( $item_id, $product );

		$design = $item->get_meta(
			'_pdp_design_json',
			true
		);

		if ( empty( $design ) ) {
			return;
		}

		?>

		<p class="pdp-order-design-actions">

			<strong>

				<?php
				esc_html_e(
					'Product Design',
					'product-designer-pro'
				);
				?>

			</strong>

			<br>

			<button
				type="button"
				class="button pdp-view-design"
				data-design="<?php echo esc_attr( $design ); ?>">

				<?php
				esc_html_e(
					'View Design',
					'product-designer-pro'
				);
				?>

			</button>

		</p>

		<?php
	}

	/**
	 * Load admin JS.
	 *
	 * @return void
	 */
	public function admin_assets() {

		wp_enqueue_style(
			'pdp-admin',
			PDP_URL . 'assets/css/admin.css',
			array(),
			PDP_VERSION
		);

		wp_enqueue_script(
			'pdp-admin-order',
			PDP_URL . 'assets/js/admin-order.js',
			array(),
			PDP_VERSION,
			true
		);
	}
}