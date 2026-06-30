<?php
/**
 * Public editor class.
 *
 * @package ProductDesignerPro
 */

// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
// phpcs:disable WordPress.NamingConventions.ValidHookName.UseUnderscores
// phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
// phpcs:disable WordPress.Security.NonceVerification.Recommended
// phpcs:disable WordPress.Security.NonceVerification.Missing

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
		if ( function_exists( 'add_action' ) ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'assets' ) );
			add_action( 'wp_ajax_pdp_save_design', array( $this, 'save_design' ) );
			add_action( 'wp_ajax_nopriv_pdp_save_design', array( $this, 'save_design' ) );
			add_action( 'wp_ajax_pdp_load_design', array( $this, 'load_design' ) );
			add_action( 'wp_ajax_nopriv_pdp_load_design', array( $this, 'load_design' ) );
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

		wp_enqueue_script(
			'pdp-admin-view',
			PDP_URL . 'assets/js/admin-view.js',
			array( 'jquery' ),
			PDP_VERSION,
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
			'design-import',
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

		$pdp_product_id = 0;

		if ( isset( $_GET['pdp_product_id'] ) && function_exists( 'absint' ) && function_exists( 'wp_unslash' ) ) {
			$pdp_product_id_raw = wp_unslash( $_GET['pdp_product_id'] );
			$pdp_product_id     = absint( $pdp_product_id_raw );
		}

		$pdp_design_id = 0;

		if ( isset( $_GET['pdp_design_id'] ) && function_exists( 'absint' ) && function_exists( 'wp_unslash' ) ) {
			$pdp_design_id_raw = wp_unslash( $_GET['pdp_design_id'] );
			$pdp_design_id     = absint( $pdp_design_id_raw );
		}

		if ( function_exists( 'wp_localize_script' ) ) {
			call_user_func(
				'wp_localize_script',
				'pdp-app',
				'pdpData',
				array(
					'ajax_url'   => function_exists( 'admin_url' ) ? call_user_func( 'admin_url', 'admin-ajax.php' ) : '',
					'nonce'      => function_exists( 'wp_create_nonce' ) ? call_user_func( 'wp_create_nonce', 'pdp_save_design' ) : '',
					'product_id' => $pdp_product_id,
					'design_id'  => $pdp_design_id,
				)
			);
		}
	}

	/**
	 * Send JSON error response.
	 *
	 * @param string $message Error message.
	 * @param array  $extra   Extra response data.
	 *
	 * @return void
	 */
	private function send_json_error( $message, $extra = array() ) {
		$response = array_merge(
			array(
				'message' => $message,
			),
			$extra
		);

		if ( function_exists( 'wp_send_json_error' ) ) {
			call_user_func( 'wp_send_json_error', $response );
		}

		echo function_exists( 'wp_json_encode' )
			? call_user_func(
				'wp_json_encode',
				array(
					'success' => false,
					'data'    => $response,
				)
			)
			: json_encode( // phpcs:ignore WordPress.WP.AlternativeFunctions.json_encode_json_encode
				array(
					'success' => false,
					'data'    => $response,
				)
			);
		exit;
	}

	/**
	 * Send JSON success response.
	 *
	 * @param array $data Response data.
	 *
	 * @return void
	 */
	private function send_json_success( $data ) {
		if ( function_exists( 'wp_send_json_success' ) ) {
			call_user_func( 'wp_send_json_success', $data );
		}

		echo function_exists( 'wp_json_encode' )
			? call_user_func(
				'wp_json_encode',
				array(
					'success' => true,
					'data'    => $data,
				)
			)
			: json_encode( // phpcs:ignore WordPress.WP.AlternativeFunctions.json_encode_json_encode
				array(
					'success' => true,
					'data'    => $data,
				)
			);
		exit;
	}

	/**
	 * Get current WordPress time.
	 *
	 * @return string
	 */
	private function get_current_time() {
		if ( function_exists( 'current_time' ) ) {
			return (string) call_user_func( 'current_time', 'mysql' );
		}

		return gmdate( 'Y-m-d H:i:s' );
	}

	/**
	 * Save design by AJAX.
	 *
	 * @return void
	 */
	public function save_design() {
		$nonce = '';

		if ( isset( $_POST['nonce'] ) && function_exists( 'wp_unslash' ) && function_exists( 'sanitize_text_field' ) ) {
			$nonce_raw = wp_unslash( $_POST['nonce'] );
			$nonce     = sanitize_text_field( $nonce_raw );
		}

		if (
			! function_exists( 'wp_verify_nonce' ) ||
			! call_user_func( 'wp_verify_nonce', $nonce, 'pdp_save_design' )
		) {
			$this->send_json_error( 'Security check failed.' );
		}

		global $wpdb;

		$table_name = 'wp_pdp_designs';

		$design_id     = 0;
		$product_id    = 0;
		$design_json   = '';
		$preview_front = '';
		$preview_back  = '';

		if ( isset( $_POST['design_id'] ) && function_exists( 'wp_unslash' ) && function_exists( 'absint' ) ) {
			$design_id_raw = wp_unslash( $_POST['design_id'] );
			$design_id     = absint( $design_id_raw );
		}

		if ( isset( $_POST['product_id'] ) && function_exists( 'wp_unslash' ) && function_exists( 'absint' ) ) {
			$product_id_raw = wp_unslash( $_POST['product_id'] );
			$product_id     = absint( $product_id_raw );
		}

		if ( isset( $_POST['design_json'] ) && function_exists( 'wp_unslash' ) && function_exists( 'sanitize_textarea_field' ) ) {
			$design_json_raw = wp_unslash( $_POST['design_json'] );
			$design_json     = sanitize_textarea_field( $design_json_raw );
		}

		if ( isset( $_POST['preview_front'] ) && function_exists( 'wp_unslash' ) && function_exists( 'sanitize_textarea_field' ) ) {
			$preview_front_raw = wp_unslash( $_POST['preview_front'] );
			$preview_front     = sanitize_textarea_field( $preview_front_raw );
		}

		if ( isset( $_POST['preview_back'] ) && function_exists( 'wp_unslash' ) && function_exists( 'sanitize_textarea_field' ) ) {
			$preview_back_raw = wp_unslash( $_POST['preview_back'] );
			$preview_back     = sanitize_textarea_field( $preview_back_raw );
		}

		$user_id = function_exists( 'get_current_user_id' ) ? (int) call_user_func( 'get_current_user_id' ) : 0;

		if ( ! $product_id || empty( $design_json ) ) {
			$this->send_json_error( 'Missing product or design data.' );
		}

		$current_time = $this->get_current_time();

		if ( $design_id ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$updated = $wpdb->update(
				$table_name,
				array(
					'product_id'    => $product_id,
					'user_id'       => $user_id,
					'design_json'   => $design_json,
					'preview_front' => $preview_front,
					'preview_back'  => $preview_back,
					'updated_at'    => $current_time,
				),
				array(
					'id' => $design_id,
				),
				array(
					'%d',
					'%d',
					'%s',
					'%s',
					'%s',
					'%s',
				),
				array(
					'%d',
				)
			);

			if ( false === $updated ) {
				$this->send_json_error(
					'Database update failed.',
					array(
						'error' => isset( $wpdb->last_error ) ? $wpdb->last_error : '',
					)
				);
			}

			$this->send_json_success(
				array(
					'message'   => 'Design updated successfully.',
					'design_id' => $design_id,
					'mode'      => 'update',
				)
			);
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$inserted = $wpdb->insert(
			$table_name,
			array(
				'product_id'    => $product_id,
				'user_id'       => $user_id,
				'design_json'   => $design_json,
				'preview_front' => $preview_front,
				'preview_back'  => $preview_back,
				'created_at'    => $current_time,
				'updated_at'    => $current_time,
			),
			array(
				'%d',
				'%d',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
			)
		);

		if ( false === $inserted ) {
			$this->send_json_error(
				'Database insert failed.',
				array(
					'error' => isset( $wpdb->last_error ) ? $wpdb->last_error : '',
				)
			);
		}

		$this->send_json_success(
			array(
				'message'   => 'Design saved successfully.',
				'design_id' => $wpdb->insert_id,
				'mode'      => 'insert',
			)
		);
	}

	/**
	 * Load design by AJAX.
	 *
	 * @return void
	 */
	public function load_design() {
		$nonce = '';

		if ( isset( $_POST['nonce'] ) && function_exists( 'wp_unslash' ) && function_exists( 'sanitize_text_field' ) ) {
			$nonce_raw = wp_unslash( $_POST['nonce'] );
			$nonce     = sanitize_text_field( $nonce_raw );
		}

		if (
			! function_exists( 'wp_verify_nonce' ) ||
			! call_user_func( 'wp_verify_nonce', $nonce, 'pdp_save_design' )
		) {
			$this->send_json_error( 'Security check failed.' );
		}

		$design_id = 0;

		if ( isset( $_POST['design_id'] ) && function_exists( 'wp_unslash' ) && function_exists( 'absint' ) ) {
			$design_id_raw = wp_unslash( $_POST['design_id'] );
			$design_id     = absint( $design_id_raw );
		}

		if ( ! $design_id ) {
			$this->send_json_error( 'Missing design ID.' );
		}

		global $wpdb;

		$table_name = 'wp_pdp_designs';

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$design = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT id, product_id, user_id, design_json, preview_front, preview_back FROM wp_pdp_designs WHERE id = %d',
				$design_id
			)
		);

		if ( ! $design ) {
			$this->send_json_error( 'Design not found.' );
		}

		$this->send_json_success(
			array(
				'design_id'     => isset( $design->id ) ? (int) $design->id : 0,
				'product_id'    => isset( $design->product_id ) ? (int) $design->product_id : 0,
				'user_id'       => isset( $design->user_id ) ? (int) $design->user_id : 0,
				'design_json'   => isset( $design->design_json ) ? $design->design_json : '',
				'preview_front' => isset( $design->preview_front ) ? $design->preview_front : '',
				'preview_back'  => isset( $design->preview_back ) ? $design->preview_back : '',
			)
		);
	}

	/**
	 * Render designer shortcode.
	 *
	 * @return string
	 */
	public function designer_shortcode() {
		$product_id = 0;

		if ( isset( $_GET['pdp_product_id'] ) && function_exists( 'absint' ) && function_exists( 'wp_unslash' ) ) {
			$product_id_raw = wp_unslash( $_GET['pdp_product_id'] );
			$product_id     = absint( $product_id_raw );
		}

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
								esc_html_e( 'Customizing:', 'product-designer-pro' );
							}
							?>
							<strong><?php echo function_exists( 'esc_html' ) ? esc_html( $product_name ) : htmlspecialchars( $product_name, ENT_QUOTES, 'UTF-8' ); ?></strong>
						</p>
					<?php else : ?>
						<p>
						<?php
						if ( function_exists( 'esc_html_e' ) ) {
							esc_html_e( 'Professional product customization editor', 'product-designer-pro' );
						}
						?>
						</p>
					<?php endif; ?>
				</div>

				<div class="pdp-top-actions">
					<button type="button" id="pdp-undo">Undo</button>
					<button type="button" id="pdp-redo">Redo</button>
					<button type="button" id="pdp-export">Export</button>
					<button type="button" id="pdp-save-design">Save Design</button>
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

					<input type="text" id="pdp-clipart-search" placeholder="Search clipart...">

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
                    <label>Layer Name</label>
                    <input type="text"
                     id="pdp-prop-layer-name"
                     placeholder="Enter layer name">

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
				<input type="hidden" name="pdp_design_id" id="pdp-design-id" value="">
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
