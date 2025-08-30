const MAX_MESSAGES = 10;
let messageCount = 3;
let messagesLeft = MAX_MESSAGES - messageCount;

// Создание элемента для уведомлений
function createNotificationElement() {
  const notification = document.createElement('div');
  notification.id = 'chat-notification';
  notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--error);
        color: white;
        padding: 12px 20px;
        border-radius: var(--radius-sm);
        box-shadow: var(--shadow-md);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
  document.body.appendChild(notification);
  return notification;
}

// Показать уведомление
function showNotification(message) {
  const notification = document.getElementById('chat-notification') || createNotificationElement();
  notification.textContent = message;
  notification.style.opacity = '1';

  setTimeout(() => {
    notification.style.opacity = '0';
  }, 4000);
}

// Обновление счетчика сообщений
function updateMessageCounter() {
  const counterElement = document.getElementById('messagesLeft');
  if (counterElement) {
    counterElement.textContent = messagesLeft;

    // Изменяем цвет в зависимости от количества оставшихся сообщений
    if (messagesLeft <= 2) {
      counterElement.style.color = 'var(--error)';
    } else if (messagesLeft <= 5) {
      counterElement.style.color = 'var(--warning)';
    } else {
      counterElement.style.color = 'var(--success)';
    }
  }
}

// Переключение темы
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// Плавная прокрутка
function initSmoothScrolling() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// Прогресс бар прокрутки
function initProgressBar() {
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  });
}

// Интерактивный чат
function initInteractiveChat() {
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatContainer = document.getElementById('chatContainer');
  const typingIndicator = document.getElementById('typingIndicator');

  if (!chatInput || !sendBtn || !chatContainer || !typingIndicator) return;

  updateMessageCounter();

  function addMessage(text, isMyMessage = true) {
    if (messagesLeft <= 0) {
      showNotification('Достигнут лимит сообщений в демо-режиме. Для продолжения скачайте приложение!');
      return false;
    }

    const message = document.createElement('div');
    message.className = isMyMessage ? 'message my-message' : 'message other-message';

    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    message.innerHTML = `
            <div class="message-text">${text}</div>
            <div class="message-time">${time}</div>
        `;

    chatContainer.appendChild(message);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    messageCount++;
    messagesLeft--;
    updateMessageCounter();

    if (messagesLeft <= 0) {
      sendBtn.disabled = true;
      chatInput.placeholder = 'Лимит сообщений исчерпан';
      showNotification('Достигнут лимит сообщений в демо-режиме. Для продолжения скачайте приложение!');
    }

    return true;
  }

  sendBtn.addEventListener('click', () => {
    if (chatInput.value.trim() !== '') {
      const success = addMessage(chatInput.value);
      if (success) {
        chatInput.value = '';

        typingIndicator.style.display = 'flex';

        setTimeout(() => {
          typingIndicator.style.display = 'none';
          if (messagesLeft > 0) {
            addMessage('Сообщения идут напрямую через P2P соединение!', false);
          }
        }, 2000);
      }
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });
}

// Ленивая загрузка
function initLazyLoading() {
  const lazyElements = document.querySelectorAll('.lazy');

  if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyElement = entry.target;
          lazyElement.classList.add('loaded');
          lazyObserver.unobserve(lazyElement);
        }
      });
    });

    lazyElements.forEach(element => {
      lazyObserver.observe(element);
    });
  } else {
    lazyElements.forEach(element => {
      element.classList.add('loaded');
    });
  }
}

// Анимация появления при скролле
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    fadeElements.forEach(element => {
      fadeInObserver.observe(element);
    });
  } else {
    fadeElements.forEach(element => {
      element.classList.add('visible');
    });
  }
}

// Имитация печатания в демо-чате
function initDemoChat() {
  const chatContainer = document.getElementById('chatContainer');
  const typingIndicator = document.getElementById('typingIndicator');

  if (!chatContainer || !typingIndicator) return;

  chatContainer.innerHTML = `
        <div class="message other-message">
            <div class="message-text">Привет! Сигнальный сервер запускается автоматически.</div>
            <div class="message-time">10:30</div>
        </div>
        <div class="message my-message">
            <div class="message-text">Отлично! Просто введи IP-адрес собеседника.</div>
            <div class="message-time">10:31</div>
        </div>
        <div class="message other-message">
            <div class="message-text">P2P соединение установлено! Сообщения идут напрямую.</div>
            <div class="message-time">10:32</div>
        </div>
    `;

  messageCount = 3;
  messagesLeft = MAX_MESSAGES - messageCount;
  updateMessageCounter();

  if (chatContainer.children.length <= 3) {
    setTimeout(() => {
      const newMessage = document.createElement('div');
      newMessage.className = 'message other-message';
      newMessage.innerHTML = `
                <div class="message-text">Сообщения идут напрямую между нашими устройствами через WebRTC! Сигнальный сервер запускается автоматически.</div>
                <div class="message-time">10:33</div>
            `;
      chatContainer.appendChild(newMessage);

      messageCount++;
      messagesLeft--;
      updateMessageCounter();

      typingIndicator.style.display = 'none';
    }, 5000);
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
  initThemeToggle();
  initSmoothScrolling();
  initProgressBar();
  initInteractiveChat();
  initLazyLoading();
  initScrollAnimations();
  initDemoChat();
  initBacklogAnimation();
});

// Обработка ошибок
window.addEventListener('error', function (e) {
  console.error('Error:', e.error);
});

// Сохранение состояния темы при загрузке
(function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
})();

// Инициализация анимации появления элементов бэклога при прокрутке страницы
function initBacklogAnimation() {
  const backlogItems = document.querySelectorAll('.backlog-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  backlogItems.forEach(item => {
    observer.observe(item);
  });
}

// Запуск модального окна
function showModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Обработка кликов по ссылкам с классом disabled-link-modal
document.querySelectorAll('.disabled-link-modal').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    showModal();
  });
});

// Закрытие модального окна при клике вне его
document.getElementById('modal').addEventListener('click', function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Закрытие модального окна по ESC
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});