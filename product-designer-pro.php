<?php
/**
 * Plugin Name: Product Designer Pro
 * Description: Professional Product Designer Plugin.
 * Version: 1.0.0
 * Author: Usama Siddique
 */

if (!defined('ABSPATH')) {
    exit;
}

define('PDP_VERSION', '1.0.0');
define('PDP_PATH', plugin_dir_path(__FILE__));
define('PDP_URL', plugin_dir_url(__FILE__));

require_once PDP_PATH . 'includes/class-product-designer-pro.php';

add_action('plugins_loaded', function () {
    Product_Designer_Pro::instance();
});