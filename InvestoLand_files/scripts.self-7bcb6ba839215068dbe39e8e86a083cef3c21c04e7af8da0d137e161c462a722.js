$(function(){
  // var scroll = new SmoothScroll('a[href*="anchor"]');

  $('#create_user').submit(function(event) {
    event.preventDefault();

    var email = $('#user_email').val();
    var country_code = $("#user_country").val();
    var phone_number = $('#user_phone_number').val();
    var action = $(this).attr('action');

    var source = $("#user_source").val();
    var medium = $("#user_medium").val();
    var campaign = $("#user_campaign").val();
    var term = $("#user_term").val();

    $.ajax({
      type: 'POST',
      url: action,
      data: {
        user: {
          'email': email,
          'phone_number': phone_number,
          'country_code': country_code,
          'source': source,
          'medium': medium,
          'campaign': campaign,
          'term': term
        }
      },
      success: function(resp){
        gtag('event', 'click', {  'event_category': 'User',  'event_action': 'Registration',  'event_label': 'Registration'});
        var type = "success";
        var msg = "Alright! You're now subscribed.";
        var container = "#form_wrapper";

        makeAlert(type, msg, container);

      },
      error: function(resp) {
        var errors = $.parseJSON(resp.responseText).errors;
        switch (errors.email[0].toString()) {
          case "can't be blank":
            var type = "error";
            var msg = "Oops! Email can't be empty";
            var container = "#form_wrapper";

            makeAlert(type, msg, container);
            break
          case 'bad format':
            var type = "error";
            var msg = "Please, provide a valid email address";
            var container = "#form_wrapper";
            makeAlert(type, msg, container);

            break
          case 'duplicated':
            var type = "error";
            var msg = "Oops! That email address is already registered";
            var container = "#form_wrapper";

            makeAlert(type, msg, container);
            break
          default:
            var type = "error";
            var msg = "error";
            var container = "#form_wrapper";

            makeAlert(type, msg, container);
            console.log(errors);
        }
      }
    });
    return false;
  });


  function makeAlert(type, msg, container) {
    var alertBox = '<div class="alert-box alert-' + type + '">' +
                    '<p>' + msg + '</p>' +
                   '</div>';
    $(".error-container").empty();
    $(".error-container").append(alertBox);
  }

  $('.showmeform').on('click', function(event) {
      event.preventDefault();
      $('html, body').animate({
          scrollTop: $('.form').offset().top
      }, 1200);
      return false;
  });

  $('.back_to_top').on('click', function(event) {
      event.preventDefault();
      $('html, body').animate({
          scrollTop: $('.welcome').offset().top
      }, 1200);
      return false;
  });

});

function showTakePicture(picture_category) {
    $("#identity-document-file-" + picture_category).hide();
    $("#identity-document-picture-" + picture_category).show();
    $('.modal').animate({
        scrollTop: $("#id-" + picture_category + "-pic-snap").offset().top
    }, 2000);

    initialize_camera("id-" + picture_category + "-pic-camera");
}

function initialize_camera(attach_to) {
    var settings = {
        width: 320,
        height: 180,
        dest_width: 1280,
        dest_height: 720,
        image_format: "jpeg",
        jpeg_quality: 100
    };

    Webcam.set(settings);
    Webcam.attach("#" + attach_to);
}

function take_snapshot(picture_category) {
    // take snapshot and get image data
    Webcam.snap(function (data_uri) {
        current_pic = data_uri;
        // display results in page
        document.getElementById(picture_category + '-result').innerHTML =
            '<img src="' + data_uri + '" style="margin: auto; width: 320px;height: 240;"/>'
        $('#' + picture_category + '-result').show()
       // $('#' + picture_category + '-submit').show()
        $('#' + picture_category + '-camera').hide()
        $('#' + picture_category + '-cancel').show()
        $('#' + picture_category + '-snap').hide()
    })

    document
        .getElementById("document_pic")
        .setAttribute("value", current_pic);
    upload_done(picture_category);

    $("#btn_whitelist_submit").prop('disabled', false);
}

function snapshotDone(picture_category) {
    document
        .getElementById("document_pic")
        .setAttribute("value", current_pic);
    upload_done(picture_category);
}

function snapshotCancelled(picture_category) {
    //$("#" + picture_category + "-submit").hide();
    $("#" + picture_category + "-camera").show();
    $("#" + picture_category + "-cancel").hide();
    $("#" + picture_category + "-snap").show();
    $("#" + picture_category + "-result").hide();
}

function upload_done(picture_category) {
    $("#" + picture_category + "-modal").modal("hide");
    //document.getElementById(picture_category + "-attach").style.pointerEvents = "none";
    $("#" + picture_category + "-attach").attr("disabled", true);
    showCheckMark(picture_category);
    $("#" + picture_category + "-uploaded").hide();
}

function showCheckMark(checkMarkId) {
    $("#" + checkMarkId + "-check").show();
}

$(document).on("change", "#user_document_photo", function () {
    $("#id-profile-modal").modal('hide');
    //file_to_upload = document.getElementById('document_photo').files[0].name;
    //document.getElementById('file_info').innerHTML = file_to_upload
    //document.getElementById("id-profile-attach").style.pointerEvents = "none";
    //$("#id-profile-attach").attr("disabled", true);

    $("#id-profile-uploaded").hide();
    $("#btn_whitelist_submit").prop('disabled', false);
});
