/**
 * @author: Shaun Janssens
 */

$(document).ready(function() {

    global = {
        // Configuration
        title : "Proposal generator",
        logo: "img/logo.png",
        company: "ARTEpreneur CVBA so",
        address: "Hoogpoort 15<br>9000 Gent<br>België",
        vat_number: "BE 0633.692.189",
        email: "info@webdrop.be",
        telephone: "+32 498 06 14 85",
        payment_time: 30,

        init : function() {
            global.config();
            quote.init();
        },

        config : function() {
            $("title").html(this.title);
            $(".logo img").attr("src", this.logo);
            $("#config_company").html(this.company);
            $("#config_address").html(this.address);
            $("#config_vat_number").html(this.vat_number);
            $("#config_email").html(this.email);
            $("#config_telephone").html(this.telephone);
        }
    }

    quote = {
        input_date_now : $("#input_date_now"),
        input_date_end : $("#input_date_end"),
        input_btw : $("#input_btw"),

        init : function() {
            this.fill_date_now();
            this.new_product();
            this.resize(this.input_btw);
        },

        /**
         * Date now
         */
        fill_date_now : function() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();

            if(dd < 10) { dd = "0" + dd }
            if(mm < 10) { mm = "0" + mm }

            today = dd + "/" + mm + "/" + yyyy;

            this.input_date_now.val(today);

            this.fill_date_end();
        },

        /**
         * Due date
         */
        fill_date_end : function() {
            var date_end = new Date();
            date_end.setDate(date_end.getDate() + global.payment_time);

            var dd = date_end.getDate();
            var mm = date_end.getMonth() + 1;
            var yyyy = date_end.getFullYear();

            if(dd < 10) { dd = "0" + dd }
            if(mm < 10) { mm = "0" + mm }

            date_end = dd + "/" + mm + "/" + yyyy;

            this.input_date_end.val(date_end);
        },

        /**
         * Add new product
         */
        new_product : function() {
            data = {};

            var handlebars = Handlebars.templates['product'];
            $(".products").append(handlebars(data));
        },

        /**
         * Resize input field
         * @param element
         */
        resize : function(element) {
            if($(element).val().length < 1) {
                var size = 1;
            } else {
                var size = $(element).val().length;
            }

            $(element).attr('size', size);
        },

        /**
         * Calculate price
         */
        calculate : function() {
            var prices = $("input.input_product_price");
            var subtotal = parseFloat("0");

            var subtotal_div = $("#subtotal");
            var btw_div = $("#btw");
            var total_div = $("#total");

            // Get BTW
            var btw_value = parseInt(this.input_btw.val()) / 100;

            // Calculate total
            for(var i = 0; i < prices.length; i++) {
                var value = parseFloat($(prices[i]).val());
                subtotal += value;
            }

            // Show BTW
            var btw = subtotal * btw_value;

            // Show total
            var total = subtotal * (btw_value + 1);

            subtotal_div.html("€ " + subtotal.toFixed(2));
            btw_div.html("€ " + btw.toFixed(2));
            total_div.html("€ " + total.toFixed(2));
        }
    }

    // Init
    global.init();

    // Copy client
    $(document).on("keyup", "#input_customer", function() {
        $("#input_customer_2").val($("#input_customer").val());
    });

    // Copy proposal number
    $(document).on("keyup", "#input_number", function() {
        $("title").html($("#input_number").val());
    });

    // Add new product
    $(document).on("click", ".product-new", function() {
       quote.new_product();
    });

    // Calculate price
    $(document).on("keyup", ".products input, #input_btw", function() {
        quote.calculate();
    });

    // Resize BTW input
    $(document).on("keyup", "#input_btw", function() {
        quote.resize(this);
    });

    // Show print dialog
    $(document).on("click", "#doprint", function () {
        // Hide comments if empty
        if($(".comments textarea").val().trim().length < 1) {
            $(".comments").hide();
        }

        // Hide project description if empty
        if($(".projectdescription textarea").val().trim().length < 1) {
            $(".projectdescription").hide();
        }

        window.print();
    });

    // Automatic resize textarea
    $(document).on("keyup input", "textarea", function(e) {
        e.preventDefault();
        var offset = this.offsetHeight - this.clientHeight;
        $(this).css('height', '18px').css('height', this.scrollHeight + offset);
    });

});