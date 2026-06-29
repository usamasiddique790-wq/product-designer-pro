<?php
/**
 * Product features.
 *
 * @package ProductDesignerPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Product integration.
 */
class PDP_Product {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action(
			'woocommerce_product_options_general_product_data',
			array( $this, 'designer_checkbox' )
		);

		add_action(
			'woocommerce_admin_process_product_object',
			array( $this, 'save_designer_checkbox' )
		);

		add_action(
			'woocommerce_before_add_to_cart_button',
			array( $this, 'customize_button' )
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
}