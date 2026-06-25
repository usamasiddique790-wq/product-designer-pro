<?php

if (!defined('ABSPATH')) {
    exit;
}

class Product_Designer_Pro {
    private static $instance = null;

    public static function instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        require_once PDP_PATH . 'public/class-product-designer-public.php';

        new Product_Designer_Public();
    }
}