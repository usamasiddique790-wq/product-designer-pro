<?php

if (!defined('ABSPATH')) {
    exit;
}

class Product_Designer_Public {
    public function __construct() {
        add_action('wp_enqueue_scripts', [$this, 'assets']);
        add_shortcode('product_designer', [$this, 'designer_shortcode']);
    }

    public function assets() {
        wp_enqueue_style(
            'pdp-public-style',
            PDP_URL . 'assets/css/public.css',
            [],
            PDP_VERSION
        );

        wp_enqueue_script(
            'fabric-js',
            'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js',
            [],
            '5.3.1',
            true
        );

        $scripts = [
    'utils',
    'product-manager',
    'view-manager',
    'templates',
    'canvas',
    'text',
    'image',
    'export',
    'history',
    'selection',
    'snap',
    'zoom-grid',
    'align',
    'layers',
    'properties',
    'toolbar',
    'app',
];
        $deps = ['fabric-js'];

        foreach ($scripts as $script) {
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

    public function designer_shortcode() {
        ob_start();
        ?>

        <div class="pdp-editor">
            <header class="pdp-editor-topbar">
                <div>
                    <h2>Product Designer Pro</h2>
                    <p>Professional product customization editor</p>
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

                    <div class="pdp-text-only">
                        <label>Font Size</label>
                        <input type="number" id="pdp-prop-font-size">

                        <label>Text Color</label>
                        <input type="color" id="pdp-prop-color">
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
        </div>

        <?php
        return ob_get_clean();
    }
}