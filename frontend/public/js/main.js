jQuery(document).ready(function ($) {
  // страница для показа по умолчанию. (edit-meet, schedule)
  var defaultPage = 'schedule';
  var currMeet = null;
  var urlStorage = 'http://localhost:3000/graphql';

  // Функция для показа нужно страницы
  function showPage (page) {
    $('[id^=page]').hide();

    // если нужна страница редактирования, то проверяем
    // - передана ли встреча для редактирования и заполняем
    if (page == 'edit-meet')
      initEditPage();

    $('#page-' + page).show();

  }

  // Редактируем вывод страницы редактирования в зависимости от объекта currMeet
  function initEditPage () {
    updateBlocks('page-edit-meet.select-participant');

    if (currMeet) {
      $('#title-edit-meet').text('Редактирование встречи');
      currMeet.each(function (key, val) {
        //$('')
      });
    } else {
      // Новая встреча
      $('#title-edit-meet').text('Новая встреча');
    }
  }

  function genQueryToStorage (op, params) {
    switch (op) {

      case 'getUsers':
        return {'query': 'query { users{id,login,avatarUrl} }'};

      case 'getUser':
        return {
          'query': 'query user( $ID : ID! ) { user(id:$ID) {id,login,avatarUrl} }',
          'variables': {'ID': params.ID}
        }
    }

  }

  // Получения данных из Бэкенда для заполнения
  function updateBlocks (block, args) {

    if (block == 'page-edit-meet.select-participant')
      op = 'getUsers';

    var dataQuery = genQueryToStorage(op, args);

    $.ajax({
      method: "GET",
      url: urlStorage,
      data: dataQuery,
      dataType: "json",
      success: function (res) {

        if (block == 'page-edit-meet.select-participant') {
          var users = res.data.users;
          $('.select-participant').html('');

          $.each(users, function (key, user) {
            $('.select-participant').append('<div class="one-participant">' + user.login + ' <span class="floor">7 этаж</span></div>');
          });
        }
      }
    });

  }

  showPage(defaultPage);

  // Обработчик для кнопок с событиями
  $('[data-act]').click(function () {
    var act = $(this).data('act');

    // Перейти на новую страницу/ страницу редактирования
    if (act == 'show-edit-meet') {
      showPage('edit-meet');
      return;
    }
    ;

    // Перейти на главную страницу
    if (act == 'show-index') {
      showPage(defaultPage);
      return;
    }
    ;

    // Удалить элемент
    if (act == 'del-elem') {
      $(this).parent().remove();
      return;
    }
    ;

  });


  // При клике по свободному слоту
  $(document).on('click', '.schedule-free', function () {
    // Для того, чтобы передать время выставляем параметр
    currMeet.date = $(this).attr('data-date');
    showPage('edit-meet');
  })

  // Копируем календарь из обычной версии в мобильную.
  //Верстка одинаковая у них
  var calendar = $('.calendar-wrap').html();
  $('#show-calendar-mobile').prepend('<div class="calendar-wrap">' + calendar + '</div>');

  $('span.table-date').click(function () {
    var parent = $(this).parent('div');
    var currCalendar = parent.find('.calendar-wrap');

    currCalendar.css('display', 'block');
  });

  // При клике добавляем класс no-hover
  // (Зачем? -> описано в Readme.md "Мучения с выпадающим списком участников:")
  $(document).on('click', '.select-participant > .one-participant', function () {
    $(this).addClass('active');
    $(".select-participant-wrap").addClass('no-hover');
  });

  // при фокусировке показываем удаляем класс no-hover.
  $('.input-participant').focus(function () {
    $(".select-participant-wrap").removeClass('no-hover');
  });

});