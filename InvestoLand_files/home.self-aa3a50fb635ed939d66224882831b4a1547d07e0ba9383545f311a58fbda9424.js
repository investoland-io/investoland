
function convert(address) {
    try {
        //address = document.getElementById('address').value;
        decoded = bitcoin.address.fromBase58Check(address);
        version = decoded['version']
        switch (version) {
            case 5:
                message = "Mainnet p2sh address: ";
                version = 50;
                break;
            case 50:
                message = "Mainnet p2sh address (deprecated): ";
                version = 5;
                break;
            case 196:
                message = "Testnet p2sh address: ";
                version = 58;
                break;
            case 58:
                message = "Testnet p2sh address (deprecated): ";
                version = 196;
                break;
            default:
                throw "unknown";
        }
        // 5 <-> 50
        // 196 <-> 58
        address = bitcoin.address.toBase58Check(decoded['hash'], version);
    } catch(err) {
        message = "Please enter a valid address."
        address = "";
    }
    //document.getElementById('message').innerText = message + address;
    document.getElementById('ltc_address').innerHTML = address;
    $("#ltc_address_qr").attr("src","https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=litecoin:"+address);

}

$(function(){


  $('#txt_whitelist_birthdate').datepicker({
      format: 'mm/dd/yyyy',
      startView:2,
      endDate:'01/01/2001',
      autoclose: true
  });

  setTimeout(function() {
    if ($('input[name=txt_draw]').val() == "true") {
      $("#modalDraw").modal("show"); 
    }
  }, 100);

  setTimeout(function() {
    if ($('input[name=txt_success]').val() == "true") {
      $("#modalThanks").modal("show"); 
    }
  }, 500);

  setTimeout(function() {
    if ($('input[name=txt_form]').val() == "true") {
      $("#modalRegistration").modal("show"); 
    }
  }, 500);

  $("#homeHeaderTeam").click(function() {
     $("body, html").animate({ 
      scrollTop: $("#homeTeam").offset().top - 80
    }, 600);
  });

  $("#homeHeaderToken").click(function() {
     $("body, html").animate({ 
      scrollTop: $("#homeToken").offset().top - 80
    }, 600);
  });

  $("#homeHeaderLogo").click(function() {
    /* $("body, html").animate({
      scrollTop: $("#homeTop").offset().top - 80
    }, 600);*/
     window.location.href='/';
  });

  $("#homeHeaderHome").click(function() {
     $("body, html").animate({ 
      scrollTop: $("#homeTop").offset().top - 80
    }, 600);
  });

  $("#btn_whitelisted").click(function() {
    if($("#txt_registration_finish").val() != ''){
      $("#modalWhitelist").modal("show");    
    }
    else{
      $("#modalPaymentMethod").modal("show");
    }
	});

 /* $("input[name='payment_method']").change(function(){
       if(this.value == 'transfer'){

       }
  });
*/
  $("#btn_draw_submit").on("click",function(){
    $.ajax({
      type: "POST",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: "/draws",
      data: { draw: {
        email: $('input[name=txt_draw_email]').val(),
        name: $('input[name=txt_draw_name]').val(),
        phone: $('input[name=txt_draw_phone]').val(),
        document: $('input[name=txt_draw_document]').val()
      } },
      success: function(){
        $('input[name=txt_draw_email]').val('');
        $('input[name=txt_draw_name]').val('');
        $('input[name=txt_draw_phone]').val('');
        $('input[name=txt_draw_document]').val('');
        $("#txt_draw_finish").val('true')
        $("#modalDraw").modal("hide");
       // $("#modalThanks").modal("show");
      },
      error: function(resp){
        var errors = $.parseJSON(resp.responseText).errors;
        errors_txt = ""
        for (messages in errors) {
          errors_txt += messages + ": " + errors[messages][0] + "<br>";
        }

        $('#draw-error-alert').show();
        //$('#project-moreinfo-success').hide();
        $("label[for='draw-error-label']").html(errors_txt);
       }
    });
  });

    //$("#btn_payment_method_submit").on("click",function(){
    $("input[name='payment_method']").change(function(){
        $.ajax({
            type: "POST",
            beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
            url: "/users",
            data: {
                method: $('input[name=payment_method]:checked').val()
           },
            success: function(){
                  $("#modalPaymentMethod").modal("hide");
                 if ($('input[name=payment_method]:checked').val() != 'payment_ethereum'){
                     $("#div_receiving_wallet").show();
                 }
                  $("#modalRegistration").modal("show");
            },
            error: function(resp){

                var errors = $.parseJSON(resp.responseText).errors;
                errors_txt = ""
                for (messages in errors) {
                    errors_txt += messages + ": " + errors[messages][0] + "<br>";
                }

                $('#registration-error-alert').show();
                //$('#project-moreinfo-success').hide();
                $("label[for='registration-error-label']").html(errors_txt);
            }
        });
    });


	$("#btn_registration_submit").on("click",function(){
    $.ajax({
      type: "POST",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: "/users",
      data: { user: {
        email: $('input[name=txt_registration_email]').val(),
        name: $('input[name=txt_registration_name]').val(),
        source: $('#txt_registration_source').val(),
        medium: $('#txt_registration_medium').val(),
        campaign: $('#txt_registration_campaign').val(),
        content: $('#txt_registration_content').val(),
        term: $('#txt_registration_term').val(),
        country: $('#txt_registration_country').val(),
        whitelist: 'true'
      } },
      success: function(){
        $('input[name=txt_registration_email]').val('');
        $('input[name=txt_registration_name]').val('');
        $("#txt_registration_finish").val('true')
        $("#modalRegistration").modal("hide");
        $("#modalWhitelist").modal("show");
      },
      error: function(resp){
        var errors = $.parseJSON(resp.responseText).errors;
        errors_txt = "";

        for (messages in errors) {
          errors_txt += messages + ": " + errors[messages][0] + "<br>";
        }

        $('#registration-error-alert').show();
        //$('#project-moreinfo-success').hide();
        $("label[for='registration-error-label']").html(errors_txt);
       }
    });
	});

  $("#btn_whitelist_step2").on("click",function(){
      birthdate_split = ""
      if ($('input[name=txt_whitelist_birthdate]').val() != ''){
          birthdate_split = $('input[name=txt_whitelist_birthdate]').val().split('/')
          birthdate_split = birthdate_split[1]+"/"+birthdate_split[0]+"/"+birthdate_split[2] 
      }
      $.ajax({
          type: "POST",
          beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
          url: "/users/whitelist",
          data: { user: {
                  address: $('input[name=txt_whitelist_address]').val(),
                  document: $('input[name=txt_whitelist_document]').val(),
                  birthdate: birthdate_split,
                  source_of_funds: $('#txt_whitelist_source_of_funds').val(),
                  sending_wallet_address: $('#txt_whitelist_sending_wallet_address').val(),
                  receiving_wallet_address: $('#txt_whitelist_receiving_wallet_address').val(),
                  residency_country_code: $('#whitelist_residency_country_code').val(),
                  citizenship_country_code: $('#whitelist_citizenship_country_code').val(),
                  accredited_investor: $('#whitelist_accredited_investor').val(),
                  wallet_type: $('#whitelist_wallet_type').val()
              } },
          success: function(){
              $('input[name=txt_whitelist_address]').val('');
              $('input[name=txt_whitelist_source_of_funds]').val('');
              $('input[name=txt_whitelist_sending_wallet_address]').val('');
              $('input[name=txt_whitelist_receiving_wallet_address]').val('');
              $('input[name=txt_whitelist_birthdate]').val('');
              $('input[name=txt_whitelist_document]').val('');
              $("#modalWhitelist").modal("hide");
              //$("#modalThanks").modal("show");
              $("#modalDocumentUpload").modal("show");
          },
          error: function(resp){

              var errors = $.parseJSON(resp.responseText).errors;
              errors_txt = ""
              for (messages in errors) {
                  errors_txt += messages + ": " + errors[messages][0] + "<br>";
              }

              $('#whitelist-error-alert').show();
              //$('#project-moreinfo-success').hide();
              $("label[for='whitelist-error-label']").html(errors_txt);
          }
      });
    });

    /*$("#whitelist_wallet_type").on("change",function(){
        var aux = this.value;
        if (aux == 'sesocio'){
            $("#div_receiving_wallet").hide();
        }else{
            $("#div_receiving_wallet").show();
        }

    });*/



  /* var form = document.getElementById('step3');
    form.onsubmit = function() {
        var formData = new FormData(form);

        formData.append('document_photo', file);

        var xhr = new XMLHttpRequest();
        // Add any event handlers here...
        xhr.open('POST', form.getAttribute('action'), true);
        xhr.send(formData);

        return false; // To avoid actual submission of the form
    }*/


   /* $("#step3").submit(function(ev){

        var data = new FormData($("#document_photo"));

        $.ajax({
            type: "POST",
            url: "/users/whitelist_photo",
            data: data,
            success: function (data) {
                alert('ok');
            },
            cache: false,
            contentType: false,
            processData: false
        });

        ev.preventDefault();
    });*/

	/*$("#step3").on("click",function(){
    $.ajax({
      type: "POST",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: "/users/whitelist_photo",
      data: { user: {
        id_profile_pic: $('input[name=id-profile-pic]').val(),
        user_document_photo: $('input[name=user_document_photo]')
      		} },
      success: function(){

        $('input[name=id-profile-pic]').val('');
        $("#modalWhitelist").modal("hide");
        window.location.href = "/home?success=true";
        //$("#modalThanks").modal("show");
      },
      error: function(resp){
        var errors = $.parseJSON(resp.responseText).errors;
        errors_txt = ""
        for (messages in errors) {
          errors_txt += messages + ": " + errors[messages][0] + "<br>";
        }

        $('#whitelist-error-alert').show();
        //$('#project-moreinfo-success').hide();
        $("label[for='whitelist-error-label']").html(errors_txt);
       }
    });
	});*/
});

