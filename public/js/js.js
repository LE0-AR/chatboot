$(document).ready(function () {
    $(".select2_el").select2({});
  });

  $(document).ready(function () {
    // Toggle fullscreen
    $(".chat-bot-icon").click(function (e) {
      $(this).children("img").toggleClass("hide");
      $(this).children("svg").toggleClass("animate");
      $(".chat-screen").toggleClass("show-chat");
    });

    $("#chat-form").submit(function (e) {
      e.preventDefault();
      $(".chat-mail").addClass("hide");
      $(".chat-body").removeClass("hide");
      $(".chat-input").removeClass("hide");
      $(".chat-header-option").removeClass("hide");

      // Primer mensaje automático después de iniciar
      $(".chat-body").append(
        '<div class="chat-bubble you">Hola, ¿en qué puedo ayudarte hoy?</div>'
      );
    });

    $("#send-message").click(function () {
      var userInput = $("#user-input").val();
      if (userInput.trim() !== "") {
        // Agregar mensaje del usuario a la pantalla del chat
        $(".chat-body").append(
          '<div class="chat-bubble me">' + userInput + "</div>"
        );
        $("#user-input").val(""); // Limpiar el campo de entrada

        // Respuesta automática después de 2 segundos
        setTimeout(function () {
          $(".chat-body").append(
            '<div class="chat-bubble you">Gracias por tu mensaje. Te responderemos pronto.</div>'
          );
          // Hacer scroll al final del chat
          $(".chat-body").scrollTop($(".chat-body")[0].scrollHeight);
        }, 100);
      }
    });

    $(".end-chat").click(function () {
      $(".chat-body").addClass("hiden");
      $(".chat-input").addClass("hide");
      $(".chat-session-end").removeClass("hide");
      $(".chat-header-option").addClass("hide");
    });
  });

  /*Enviar mensahe en js*/
