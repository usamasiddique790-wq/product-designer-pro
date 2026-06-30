<?php
/**
 * Database helper.
 *
 * @package ProductDesignerPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * PDP Database class.
 */
class PDP_Database {

	/**
	 * Create plugin tables.
	 *
	 * @return void
	 */
	public static function create_tables() {

		global $wpdb;

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$table_name      = $wpdb->prefix . 'pdp_designs';
		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE {$table_name} (
			id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			product_id BIGINT(20) UNSIGNED NOT NULL,
			user_id BIGINT(20) UNSIGNED NOT NULL DEFAULT 0,
			order_id BIGINT(20) UNSIGNED NOT NULL DEFAULT 0,
			design_json LONGTEXT NOT NULL,
			preview_front LONGTEXT NULL,
			preview_back LONGTEXT NULL,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			PRIMARY KEY (id),
			KEY product_id (product_id),
			KEY user_id (user_id),
			KEY order_id (order_id)
		) {$charset_collate};";

		dbDelta( $sql );
	}
}
