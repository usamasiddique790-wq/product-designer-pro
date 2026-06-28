<?php
/**
 * WooCommerce integration.
 *
 * @package ProductDesignerPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Product Designer WooCommerce integration class.
 */
class Product_Designer_WooCommerce {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'woocommerce_before_add_to_cart_button', array( $this, 'customize_button' ) );
		add_action( 'woocommerce_product_options_general_product_data', array( $this, 'designer_checkbox' ) );
		add_action( 'woocommerce_admin_process_product_object', array( $this, 'save_designer_checkbox' ) );

		add_filter( 'woocommerce_add_cart_item_data', array( $this, 'add_design_to_cart_item' ), 10, 2 );
		add_filter( 'woocommerce_get_item_data', array( $this, 'display_design_in_cart' ), 10, 2 );

		add_action(
			'woocommerce_checkout_create_order_line_item',
			array( $this, 'save_design_to_order_item' ),
			10,
			4
		);

		add_action(
			'woocommerce_after_order_itemmeta',
			array( $this, 'show_design_button' ),
			10,
			3
		);
	}

	/**
	 * Product designer checkbox.
	 *
	 * @return void
	 */
	public function designer_checkbox() {
		woocommerce_wp_checkbox(
			array(
				'id'          => '_pdp_enable_designer',
				'label'       => esc_html__( 'Enable Product Designer', 'product-designer-pro' ),
				'description' => esc_html__( 'Allow customers to customize this product.', 'product-designer-pro' ),
			)
		);
	}

	/**
	 * Save checkbox.
	 *
	 * @param object $product Product object.
	 *
	 * @return void
	 */
	public function save_designer_checkbox( $product ) {
		$enabled = isset( $_POST['_pdp_enable_designer'] ) ? 'yes' : 'no'; // phpcs:ignore WordPress.Security.NonceVerification.Missing

		$product->update_meta_data( '_pdp_enable_designer', $enabled );
	}

	/**
	 * Show customize button.
	 *
	 * @return void
	 */
	public function customize_button() {
		if ( ! function_exists( 'is_product' ) || ! is_product() ) {
			return;
		}

		global $product;

		if ( ! $product || 'yes' !== $product->get_meta( '_pdp_enable_designer' ) ) {
			return;
		}

		$designer_url = add_query_arg(
			array(
				'pdp_product_id' => absint( $product->get_id() ),
			),
			site_url( '/designer/' )
		);
		?>
		<p class="pdp-customize-wrap">
			<a class="button pdp-customize-button" href="<?php echo esc_url( $designer_url ); ?>">
				<?php esc_html_e( 'Customize Product', 'product-designer-pro' ); ?>
			</a>
		</p>
		<?php
	}

	/**
	 * Add design data to cart item.
	 *
	 * @param array $cart_item_data Cart item data.
	 * @param int   $product_id     Product ID.
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
	 * Display design status in cart.
	 *
	 * @param array $item_data Cart item display data.
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
	/**
	 * Show View Design button in admin order.
	 *
	 * @param int   $item_id Order item ID.
	 * @param mixed $item    Order item.
	 * @param mixed $product Product.
	 *
	 * @return void
	 */
	public function show_design_button( $item_id, $item, $product ) {

		unset( $item_id );
		unset( $product );

		$design_json = $item->get_meta( '_pdp_design_json', true );

		if ( empty( $design_json ) ) {
			return;
		}

		?>
	<p style="margin-top:10px;">
		<button
			type="button"
			class="button pdp-view-design"
			data-design="<?php echo esc_attr( $design_json ); ?>">
			<?php esc_html_e( 'View Design', 'product-designer-pro' ); ?>
		</button>
	</p>
		<?php
	}
	/**
	 * Save design JSON to order item.
	 *
	 * @param object $item          Order item.
	 * @param string $cart_item_key Cart item key.
	 * @param array  $values        Cart item values.
	 * @param object $order         Order object.
	 *
	 * @return void
	 */
	public function save_design_to_order_item( $item, $cart_item_key, $values, $order ) {
		unset( $cart_item_key, $order );

		if ( empty( $values['pdp_design_json'] ) ) {
			return;
		}

		if ( ! method_exists( $item, 'add_meta_data' ) ) {
			return;
		}

		$item->add_meta_data(
			'_pdp_design_json',
			(string) $values['pdp_design_json'],
			true
		);
	}
}