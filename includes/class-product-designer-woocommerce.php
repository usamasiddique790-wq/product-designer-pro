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
		if ( ! function_exists( 'add_action' ) ) {
			return;
		}

		add_action( 'woocommerce_before_add_to_cart_button', array( $this, 'customize_button' ) );
		add_action( 'woocommerce_product_options_general_product_data', array( $this, 'designer_checkbox' ) );
		add_action( 'woocommerce_admin_process_product_object', array( $this, 'save_designer_checkbox' ) );
	}

	/**
	 * Product designer checkbox.
	 *
	 * @return void
	 */
	public function designer_checkbox() {
		$label       = function_exists( 'esc_html__' ) ? esc_html__( 'Enable Product Designer', 'product-designer-pro' ) : 'Enable Product Designer';
		$description = function_exists( 'esc_html__' ) ? esc_html__( 'Allow customers to customize this product.', 'product-designer-pro' ) : 'Allow customers to customize this product.';

		woocommerce_wp_checkbox(
			array(
				'id'          => '_pdp_enable_designer',
				'label'       => $label,
				'description' => $description,
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
		if ( ! is_product() ) {
			return;
		}

		global $product;

		if ( ! $product ) {
			return;
		}

		if ( 'yes' !== $product->get_meta( '_pdp_enable_designer' ) ) {
			return;
		}

		// Build designer URL. Use add_query_arg when available, otherwise fall back to a safe manual build.
		if ( ! function_exists( 'site_url' ) || ! function_exists( 'esc_url' ) ) {
			return;
		}

		if ( function_exists( 'add_query_arg' ) ) {
			$designer_url = add_query_arg(
				array(
					'pdp_product_id' => intval( $product->get_id(), 10 ),
				),
				site_url( '/designer/' )
			);
		} else {
			$designer_url = site_url( '/designer/' ) . '?pdp_product_id=' . intval( $product->get_id(), 10 );
		}

		?>
		<p class="pdp-customize-wrap">
			<a class="button pdp-customize-button" href="<?php echo esc_url( $designer_url ); ?>">
				<?php echo function_exists( 'esc_html__' ) ? esc_html__( 'Customize Product', 'product-designer-pro' ) : 'Customize Product'; ?>
			</a>
		</p>
		<?php
	}
}