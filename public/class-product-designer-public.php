<?php
/**
 * Public editor class.
 *
 * @package ProductDesignerPro
 */

// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
// phpcs:disable WordPress.NamingConventions.ValidHookName.UseUnderscores

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Public Product Designer class.
 */
class Product_Designer_Public {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Only hook into WordPress if functions are available (prevents static analyzers/errors
		// when this file is parsed outside of a WP runtime).
		if ( function_exists( 'add_action' ) ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'assets' ) );
		}
		if ( function_exists( 'add_shortcode' ) ) {
			add_shortcode( 'product_designer', array( $this, 'designer_shortcode' ) );
		}
	}

	/**
	 * Enqueue public assets.
	 *
	 * @return void
	 */
	public function assets() {
		// Bail if WP functions are not available (prevents static analyzers/errors
		// when this file is parsed outside of a WP runtime).
		if ( ! function_exists( 'wp_enqueue_style' ) || ! function_exists( 'wp_enqueue_script' ) ) {
			return;
		}
		wp_enqueue_style(
			'pdp-public-style',
			PDP_URL . 'assets/css/public.css',
			array(),
			PDP_VERSION
		);

		wp_enqueue_style(
			'pdp-google-fonts',
			'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700&family=Poppins:wght@400;700&family=Roboto:wght@400;700&display=swap',
			array(),
			PDP_VERSION
		);

		wp_enqueue_script(
			'fabric-js',
			'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js',
			array(),
			'5.3.1',
			true
		);

		$scripts = array(
			'utils',
			'product-context',
			'product-manager',
			'view-manager',
			'templates',
			'canvas',
			'text',
			'image',
			'clipart',
			'export',
			'history',
			'selection',
			'snap',
			'zoom-grid',
			'align',
			'shortcuts',
			'layers',
			'properties',
			'toolbar',
			'app',
		);

		$deps = array( 'fabric-js' );

		foreach ( $scripts as $script ) {
			wp_enqueue_script(
				'pdp-' . $script,
				PDP_URL . 'assets/js/' . $script . '.js',
				$deps,
				PDP_VERSION,
				true
			);

			$deps[] = 'pdp-' . $script;
		}
	}

	/**
	 * Render designer shortcode.
	 *
	 * @return string
	 */
	public function designer_shortcode() {
		$product_id    = isset( $_GET['pdp_product_id'] ) && function_exists( 'absint' ) ? absint( $_GET['pdp_product_id'] ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$product_name  = '';
		$product_image = '';

		if ( $product_id && function_exists( 'wc_get_product' ) ) {
			$product = wc_get_product( $product_id );

			if ( $product ) {
				$product_name  = $product->get_name();
				$product_image = function_exists( 'wp_get_attachment_image_url' )
					? wp_get_attachment_image_url( $product->get_image_id(), 'large' )
					: '';
			}
		}

		ob_start();
		?>

		<div class="pdp-editor">
			<header class="pdp-editor-topbar">
				<div>
					<h2>Product Designer Pro</h2>

					<?php if ( $product_name ) : ?>
						<p>
							<?php
							if ( function_exists( 'esc_html_e' ) ) {
								esc_html_e( 'Customizing:', 'product-designer-pro' ); }
							?>
							<strong><?php echo function_exists( 'esc_html' ) ? esc_html( $product_name ) : htmlspecialchars( $product_name, ENT_QUOTES, 'UTF-8' ); ?></strong>
						</p>
					<?php else : ?>
						<p>
						<?php
						if ( function_exists( 'esc_html_e' ) ) {
							esc_html_e( 'Professional product customization editor', 'product-designer-pro' ); }
						?>
						</p>
					<?php endif; ?>
				</div>

				<div class="pdp-top-actions">
					<button type="button" id="pdp-undo">Undo</button>
					<button type="button" id="pdp-redo">Redo</button>
					<button type="button" id="pdp-export">Export</button>
				</div>
			</header>

			<div class="pdp-editor-toolbar">
				<select id="pdp-product-select">
					<option value="tshirt">T-Shirt</option>
					<option value="mug">Mug</option>
				</select>

				<div class="pdp-view-switcher">
					<button type="button" id="pdp-view-front" class="active">Front</button>
					<button type="button" id="pdp-view-back">Back</button>
				</div>

				<button type="button" id="pdp-add-text">Add Text</button>

				<label class="pdp-upload-btn">
					Upload Image
					<input type="file" id="pdp-upload-image" accept="image/*">
				</label>

				<select id="pdp-font-family">
					<option value="Arial">Arial</option>
					<option value="Roboto">Roboto</option>
					<option value="Poppins">Poppins</option>
					<option value="Montserrat">Montserrat</option>
					<option value="Oswald">Oswald</option>
					<option value="Lato">Lato</option>
					<option value="Playfair Display">Playfair Display</option>
				</select>

				<input type="color" id="pdp-text-color" value="#000000">
				<input type="number" id="pdp-font-size" value="36" min="10" max="200">

				<button type="button" id="pdp-bold">Bold</button>
				<button type="button" id="pdp-italic">Italic</button>
				<button type="button" id="pdp-front">Bring Front</button>
				<button type="button" id="pdp-back">Send Back</button>

				<button type="button" id="pdp-align-left">Align Left</button>
				<button type="button" id="pdp-align-center">Center</button>
				<button type="button" id="pdp-align-right">Align Right</button>
				<button type="button" id="pdp-align-top">Top</button>
				<button type="button" id="pdp-align-middle">Middle</button>
				<button type="button" id="pdp-align-bottom">Bottom</button>

				<button type="button" id="pdp-zoom-in">Zoom +</button>
				<button type="button" id="pdp-zoom-out">Zoom -</button>
				<button type="button" id="pdp-zoom-reset">100%</button>
				<button type="button" id="pdp-toggle-grid">Grid</button>
			</div>

			<main class="pdp-editor-main">
				<aside class="pdp-panel pdp-layers-panel">
					<div class="pdp-panel-header">
						<h3>Layers</h3>
					</div>

					<div id="pdp-layers-list" class="pdp-layers-list">
						<p class="pdp-muted">No layers yet</p>
					</div>

					<hr>

					<div class="pdp-panel-header">
						<h3>Clipart</h3>
					</div>

					<input
						type="text"
						id="pdp-clipart-search"
						placeholder="Search clipart..."
					>

					<div id="pdp-clipart-list" class="pdp-clipart-list"></div>
				</aside>

				<section class="pdp-canvas-stage">
					<div class="pdp-canvas-area">
						<canvas id="pdp-canvas" width="620" height="600"></canvas>
					</div>
				</section>

				<aside class="pdp-panel pdp-properties">
					<div class="pdp-panel-header">
						<h3>Properties</h3>
					</div>

					<label>X</label>
					<input type="number" id="pdp-prop-left">

					<label>Y</label>
					<input type="number" id="pdp-prop-top">

					<label>Width</label>
					<input type="number" id="pdp-prop-width">

					<label>Height</label>
					<input type="number" id="pdp-prop-height">

					<label>Rotation</label>
					<input type="number" id="pdp-prop-angle">

					<label>Opacity</label>
					<input type="range" id="pdp-prop-opacity" min="0" max="1" step="0.1">

					<div class="pdp-text-only" style="display:none;">
						<label>Font Size</label>
						<input type="number" id="pdp-prop-font-size">

						<label>Text Color</label>
						<input type="color" id="pdp-prop-color">
					</div>

					<div class="pdp-shape-only" style="display:none;">
						<label>Clipart Color</label>
						<input type="color" id="pdp-prop-shape-color" value="#2563eb">
					</div>

					<button type="button" id="pdp-prop-duplicate">Duplicate</button>
					<button type="button" id="pdp-prop-lock">Lock</button>
					<button type="button" id="pdp-delete">Delete</button>
				</aside>
			</main>

			<footer class="pdp-statusbar">
				<span>Zoom: 100%</span>
				<span id="pdp-status-objects">Objects: 0</span>
				<span id="pdp-status-active">Active: None</span>
			</footer>

			<textarea id="pdp-output" placeholder="Exported JSON / PNG will appear here"></textarea>

			<input type="hidden" id="pdp-product-id" value="<?php echo function_exists( 'esc_attr' ) ? esc_attr( $product_id ) : $product_id; ?>">
			<input type="hidden" id="pdp-product-name" value="<?php echo function_exists( 'esc_attr' ) ? esc_attr( $product_name ) : $product_name; ?>">
			<input type="hidden" id="pdp-product-image" value="<?php echo function_exists( 'esc_url' ) ? esc_url( $product_image ) : $product_image; ?>">
		</div>
		<?php if ( $product_id ) : ?>
	<form class="pdp-add-to-cart-form" method="post" action="<?php echo function_exists( 'esc_url' ) ? esc_url( wc_get_cart_url() ) : wc_get_cart_url(); ?>">
		<input type="hidden" name="add-to-cart" value="<?php echo function_exists( 'esc_attr' ) ? esc_attr( $product_id ) : $product_id; ?>">
		<input type="hidden" name="pdp_design_json" id="pdp-design-json" value="">
		<button type="submit" id="pdp-add-to-cart" class="button">
					<?php
					if ( function_exists( 'esc_html_e' ) ) {
						esc_html_e( 'Add to Cart with Design', 'product-designer-pro' );
					} else {
						echo 'Add to Cart with Design';
					}
					?>
		</button>
	</form>
		<?php endif; ?>
		<?php
		return ob_get_clean();
	}
}