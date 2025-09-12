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
function initInteractiveChat() {
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatContainer = document.getElementById('chatContainer');
  const typingIndicator = document.getElementById('typingIndicator');

  if (!chatInput || !sendBtn || !chatContainer || !typingIndicator) return;

  updateMessageCounter();

  function addMessage(text, isMyMessage = true, isTranslatable = false) {
    if (messagesLeft <= 0) {
      showNotification('notificationLimit');
      return false;
    }

    const message = document.createElement('div');
    message.className = isMyMessage ? 'message my-message' : 'message other-message';
    
    if (isTranslatable) {
      message.setAttribute('data-translatable', 'true');
      message.setAttribute('data-key', text);
    }

    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    message.innerHTML = `
            <div class="message-text">${isTranslatable ? getTranslation(text) : text}</div>
            <div class="message-time">${time}</div>
        `;

    chatContainer.appendChild(message);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    messageCount++;
    messagesLeft--;
    updateMessageCounter();

    if (messagesLeft <= 0) {
      sendBtn.disabled = true;
      chatInput.placeholder = getTranslation('notificationLimit');
      showNotification('notificationLimit');
    }

    return true;
  }

  sendBtn.addEventListener('click', () => {
    if (chatInput.value.trim() !== '') {
      const success = addMessage(chatInput.value, true, false);
      if (success) {
        chatInput.value = '';

        typingIndicator.style.display = 'flex';

        setTimeout(() => {
          typingIndicator.style.display = 'none';
          if (messagesLeft > 0) {
            addMessage('notificationmessage', false, true);
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

function updateTranslatableMessages() {
  const translatableMessages = document.querySelectorAll('[data-translatable="true"]');
  translatableMessages.forEach(message => {
    const key = message.getAttribute('data-key');
    const textElement = message.querySelector('.message-text');
    if (textElement && key) {
      textElement.textContent = getTranslation(key);
    }
  });
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

function initLanguageToggle() {
  const langToggle = document.getElementById('langToggle');
  if (!langToggle) return;

  const savedLang = localStorage.getItem('lang') || 'ru';
  langToggle.checked = savedLang === 'en';

  langToggle.addEventListener('change', function() {
    const newLang = this.checked ? 'en' : 'ru';
    changeLanguage(newLang);
  });
}

// Переводы
const translations = {
  en: {
    notificationmessage: "Messages go directly through P2P connection!",
    notificationLimit: "Message limit reached in demo mode. Download the app to continue!",
    howitworks: "How to connect",
    download: "Download",
    privacy: "Privacy in every message",
    about: "BlockChat — is a messenger with direct peer-to-peer communication between users. Your messages are transmitted directly, without being stored on servers.",
    report: "Report an error",
    protected: "Protected",
    message1: "Hello! The signal server starts automatically.",
    message2: "Great! Just enter the other person's IP address.",
    message3: "P2P connection established! Messages are sent directly.",
    interlocutor: "The interlocutor types",
    messagelimit: "There are still messages left:",
    send: "Send",
    features: "Features BlockChat",
    uniquefeatures: "Unique features of our P2P messenger",
    importantinformation: "Important information",
    lan: "It works on a local area network (LAN)",
    newlan: "NEW: outside the local network via Radmin VPN",
    ip: "Requires a stable IP to connect",
    port: "The signal server automatically starts on port 8080",
    textmessages: "Text message only support (for now!)",
    safety: "Security and privacy",
    correspondence: "Your messages are never stored on servers. All correspondence remains between the participants of the conversation.",
    connection: "Direct P2P connection",
    thesignalserver: "After establishing a connection through a signaling server, messages are transmitted directly between devices without intermediate servers.",
    delivery: "Instant delivery",
    instantly: "Messages are delivered instantly thanks to the direct connection between users. No delays on the servers.",
    markdown: "Markdown support in messages",
    formatting: "Format text easily and quickly! BlockChat supports Markdown markup for creating bold and italic text, lists, quotes, and more.",
    interface: "Simple interface",
    intuitiveinterface: "The intuitive interface makes it easy to set up a connection and start communicating without complex settings.",
    crossplatform: "Cross-platform",
    availability: "Available for Windows, Linux, and macOS. Connect with users of different operating systems.",
    process: "A simple process for installing a secure P2P connection",
    launch: "Launch BlockChat on both devices",
    thesignalserver: "The signal server starts automatically when needed. No need to start it manually anymore!",
    ipaddresses: "Exchange IP addresses",
    initiator: "One user becomes the initiator (connects), and the other becomes the receiver (waits to be connected). Exchange IP addresses.",
    p2pconnection: "Establish a P2P connection",
    signalexchange: "After exchanging signals through an automatically running server, a direct connection is established between the devices.",
    communication: "Start chatting",
    safecommunication: "Enjoy secure communication directly! Messages are transmitted without intermediate servers.",
    connectiontips: "Connection Tips:",
    connectionsoutside: "Use Radmin VPN or similar solutions to communicate outside your local network",
    firewall: "Make sure that the firewall allows connections on port 8080",
    staticipaddresses: "Use static IP addresses for a stable connection",
    roadmap: "Development roadmap",
    ourway: "Our journey to creating the perfect P2P messenger",
    basicp2p: "Basic P2P architecture",
    completed: "Completed",
    realization: "A direct connection between users is implemented using the WebRTC and simple-peer libraries.",
    signalserver: "Automatic Signal Server",
    startsautomatically: "The server now starts automatically! You no longer need to start it manually.",
    endtoend: "End-to-end encryption",
    implementingencryption: "Implementing message encryption for complete privacy in your correspondence.",
    release1: "v1.0.0 release",
    release: "RELEASE",
    firststable: "The first stable release of BlockChat! is available for download on Windows, Linux and MacOS with basic P2P functionality.",
    sendingfiles: "Sending files",
    indevelopment: "In development",
    filefunctionality: "Development of functionality for sending files to a partner via a P2P connection.",
    offline: "Connecting outside the local network",
    planned: "Planned",
    offlinetechnologies: "Development of technology for connecting outside the local network without using third-party programs.",
    release2: "v2.0.0 release",
    secondrelease: "The second stable release of BlockChat! is available for download on Windows, Linux and MacOS with advanced P2P functionality.",
    groupchats: "Group chats",
    functionalgroups: "Development of functionality for creating group chats with multiple participants.",
    mobileapp: "The mobile app",
    mobiledevelopment: "Development of mobile versions of BlockChat for iOS and Android with full compatibility.",
    release3: "v3.0.0 release",
    secondstablerelease: "The second stable release of BlockChat! is available for download on all devices with advanced P2P functionality.",
    startusing: "Start using BlockChat today",
    joincommunity: "Join a community of users who value direct communication without intermediaries",
    windows: "Download for Windows",
    linux: "Download for Linux",
    mac: "Download for MacOS",
    temporarilyunavailable: "Temporarily unavailable",
    featuredevelopment: "This feature is currently under development. We are working on improving the website and will soon add this feature.",
    okay: 'Okay',
    developers: "Developers",
    product: "Product",
    features: "Features",
    backlog: "Backlog",
    support: "Support",
    request: "Request a function",
    rightsreserved: "© 2025 BlockChat. All rights reserved. | Designed for private communication",
    enter: "Enter a message...",
    automatically: "Messages are sent directly between our devices via WebRTC! The signaling server starts automatically.",
    interlocutor: "The interlocutor types",
    temporaryUnavailableTitle: "Temporarily unavailable for download",
    temporaryUnavailableText: "Due to the resolution of legal issues related to the legislation of the Russian Federation, downloading the program is temporarily suspended. We are actively working on bringing the project into compliance with legal requirements and continue to develop new features.",
    developmentContinues: "BlockChat development continues! Follow updates on our site.",
    BlogFooter: 'Blog',
    ReleaseFooter: 'Releases',
    TitleDevelopers: 'The development team',
    DescriptionDevelopers: 'The talented developers who created BlockChat',
    MainDeveloper: 'Main Developer',
    developer: 'Developer',
    site: 'Website',
    LegalInf: 'Legal information',
    LegalPol: 'Privacy policy'
  },
  ru: {
    notificationmessage: "Сообщения идут напрямую через P2P соединение!",
    notificationLimit: "Достигнут лимит сообщений в демо-режиме. Для продолжения скачайте приложение!",
    howitworks: "Как подключиться",
    download: "Скачать",
    privacy: "Приватность в каждом сообщении",
    about: "BlockChat — это мессенджер с прямой peer-to-peer связью между пользователями. Ваши сообщения передаются напрямую, без хранения на серверах.",
    report: "Cообщить об ошибке",
    protected: "Защищено",
    message1: "Привет! Сигнальный сервер запускается автоматически.",
    message2: "Отлично! Просто введи IP-адрес собеседника.",
    message3: "P2P соединение установлено! Сообщения идут напрямую.",
    Interlocutor: "Собеседник печатает",
    messagelimit: "Осталось сообщений:",
    send: "Отправить",
    features: "Особенности BlockChat",
    uniquefeatures: "Уникальные возможности нашего P2P мессенджера",
    importantinformation: "Важная информация",
    lan: "Работает в локальной сети (LAN)",
    newlan: "НОВОЕ: вне локальной сети через Radmin VPN",
    ip: "Требует стабильного IP для подключения",
    port: "Сигнальный сервер автоматически запускается на порту 8080",
    textmessages: "Поддержка только текстовых сообщений (пока!)",
    safety: "Безопасность и приватность",
    correspondence: "Ваши сообщения никогда не хранятся на серверах. Вся переписка остается только между участниками беседы.",
    connection: "Прямое P2P соединение",
    thesignalserver: "После установки связи через сигнальный сервер, сообщения передаются напрямую между устройствами без промежуточных серверов.",
    delivery: "Мгновенная доставка",
    instantly: "Сообщения доставляются мгновенно благодаря прямому соединению между пользователями. Никаких задержек на серверах.",
    markdown: "Поддержка Markdown в сообщениях",
    formatting: "Форматируйте текст легко и быстро! BlockChat поддерживает Markdown-разметку для создания жирного и курсивного текста, списков, цитат и многого другого.",
    interface: "Простой интерфейс",
    intuitiveinterface: "Интуитивно понятный интерфейс позволяет легко установить соединение и начать общение без сложных настроек.",
    crossplatform: "Кроссплатформенность",
    availability: "Доступно для Windows, Linux и macOS. Общайтесь с пользователями разных операционных систем.",
    process: "Простой процесс установки защищенного P2P-соединения",
    launch: "Запустите BlockChat на обоих устройствах",
    thesignalserver: "Сигнальный сервер запускается автоматически при необходимости. Больше не нужно запускать его вручную!",
    ipaddresses: "Обменяйтесь IP-адресами",
    initiator: "Один пользователь становится инициатором (подключается), а другой - получателем (ожидает подключения). Обменивайтесь IP-адресами.",
    p2pconnection: "Установите P2P соединение",
    signalexchange: "После обмена сигналами через автоматически запущенный сервер устанавливается прямое соединение между устройствами.",
    communication: "Начните общение",
    safecommunication: "Наслаждайтесь безопасным общением напрямую! Сообщения передаются без промежуточных серверов.",
    connectiontips: "Советы по подключению:",
    connectionsoutside: "Для связи вне локальной сети используйте Radmin VPN или аналогичные решения",
    firewall: "Убедитесь, что брандмауэр разрешает соединения на порту 8080",
    staticipaddresses: "Используйте статические IP-адреса для стабильного соединения",
    roadmap: "Дорожная карта разработки",
    ourway: "Наш путь к созданию идеального P2P мессенджера",
    basicp2p: "Базовая P2P-архитектура",
    completed: "Завершено",
    realization: "Реализовано прямое соединение между пользователями с использованием WebRTC и simple-peer библиотеки.",
    signalserver: "Автоматический сигнальный сервер",
    startsautomatically: "Сервер теперь запускается автоматически! Больше не нужно запускать его вручную.",
    endtoend: "End-to-end шифрование",
    implementingencryption: "Внедрение шифрования сообщений для полной конфиденциальности переписки.",
    release1: "Выпуск v1.0.0",
    release: "РЕЛИЗ",
    firststable: "Первый стабильный релиз BlockChat! Доступно для скачивания на Windows, Linux и MacOS с базовым P2P функционалом.",
    sendingfiles: "Отправка файлов",
    indevelopment: "В разработке",
    filefunctionality: "Разработка функционала для отправки файлов собеседнику через P2P соединение.",
    offline: "Подключение вне локальной сети",
    planned: "Запланировано",
    offlinetechnologies: "Разработка технологии для подключения вне локальной сети без использования сторонних програм.",
    release2: "Выпуск v2.0.0",
    secondrelease: "Второй стабильный релиз BlockChat! Доступно для скачивания на Windows, Linux и MacOS с расширенным P2P функционалом.",
    groupchats: "Групповые чаты",
    functionalgroups: "Разработка функционала для создания групповых чатов с поддержкой нескольких участников.",
    mobileapp: "Мобильное приложение",
    mobiledevelopment: "Разработка мобильных версий BlockChat для iOS и Android с полной совместимостью.",
    release3: "Выпуск v3.0.0",
    secondstablerelease: "Второй стабильный релиз BlockChat! Доступно для скачивания на всех устройствах с расширенным P2P функционалом.",
    startusing: "Начните использовать BlockChat сегодня",
    joincommunity: "Присоединяйтесь к сообществу пользователей, ценящих прямое общение без посредников",
    windows: "Скачать для Windows",
    linux: "Скачать для Linux",
    mac: "Скачать для MacOS",
    temporarilyunavailable: "Временно недоступно",
    featuredevelopment: "Данная функция находится в разработке. Мы работаем над улучшением сайта и скоро добавим эту возможность.",
    okay: 'Понятно',
    developers: "Разработчики",
    product: "Продукт",
    features: "Особенности",
    backlog: "Бэклог",
    support: "Поддержка",
    request: "Запросить функцию",
    rightsreserved: "© 2025 BlockChat. Все права защищены. | Разработано для приватного общения",
    enter: "Введите сообщение...",
    automatically: "Сообщения идут напрямую между нашими устройствами через WebRTC! Сигнальный сервер запускается автоматически.",
    interlocutor: "Собеседник печатает",
    temporaryUnavailableTitle: "Временно недоступно для скачивания",
    temporaryUnavailableText: "В связи с решением юридических вопросов, связанных с законодательством РФ, скачивание программы временно приостановлено. Мы активно работаем над приведением проекта в соответствие с требованиями законодательства и продолжаем разработку новых функций.",
    developmentContinues: "Разработка BlockChat продолжается! Следите за обновлениями на нашем сайте.",
    BlogFooter: 'Блог',
    ReleaseFooter: 'Релизы',
    TitleDevelopers: 'Команда разработчиков',
    DescriptionDevelopers: 'Талантливые разработчики, создавшие BlockChat',
    MainDeveloper: 'Главный разработчик',
    developer: 'Разработчик',
    site: 'Сайт',
    LegalInf: 'Правовая информация',
    LegalPol: 'Политика конфиденциальности'
  }
};

// Функция смены языка
function changeLanguage(lang) {
  localStorage.setItem('lang', lang);

  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    if (messagesLeft <= 0) {
      chatInput.placeholder = getTranslation('notificationLimit');
    } else {
      chatInput.placeholder = getTranslation('enter');
    }
  }

  const typingText = document.querySelector('.typing-indicator span');
  if (typingText) {
    typingText.textContent = getTranslation('interlocutor');
  }

  updateChatMessages(lang);
  
  updateTranslatableMessages();
}

function getTranslation(key) {
  const currentLang = localStorage.getItem('lang') || 'ru';
  return translations[currentLang][key] || key;
}

function updateChatMessages(lang) {
  const chatContainer = document.getElementById('chatContainer');
  if (!chatContainer) return;

  const langData = translations[lang] || translations['ru'];
  const messages = chatContainer.querySelectorAll('.message');
  
  if (messages.length >= 3) {
    messages[0].querySelector('.message-text').textContent = langData.message1;
    messages[1].querySelector('.message-text').textContent = langData.message2;
    messages[2].querySelector('.message-text').textContent = langData.message3;
  }

  if (messages.length >= 4) {
    messages[3].querySelector('.message-text').textContent = langData.automatically;
  }
}

document.getElementById('langToggle').addEventListener('change', function() {
  const newLang = this.checked ? 'en' : 'ru';
  changeLanguage(newLang);
});

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'ru';

  const toggle = document.getElementById('langToggle');
  toggle.checked = savedLang === 'en';

  changeLanguage(savedLang);
});


// Плавная прокрутка
function initSmoothScrolling() {
  document.querySelectorAll('.smooth').forEach(link => {
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
  const chatInput = document.getElementById('chatInput');

  if (!chatContainer || !typingIndicator || !chatInput) return;

  const currentLang = localStorage.getItem('lang') || 'ru';
  const langData = translations[currentLang];

  chatInput.placeholder = langData.enter;

  chatContainer.innerHTML = `
    <div class="message other-message">
      <div class="message-text">${langData.message1}</div>
      <div class="message-time">10:30</div>
    </div>
    <div class="message my-message">
      <div class="message-text">${langData.message2}</div>
      <div class="message-time">10:31</div>
    </div>
    <div class="message other-message">
      <div class="message-text">${langData.message3}</div>
      <div class="message-time">10:32</div>
    </div>
  `;

  messageCount = 3;
  messagesLeft = MAX_MESSAGES - messageCount;
  updateMessageCounter();

  typingIndicator.style.display = 'flex';

  setTimeout(() => {
    const newMessage = document.createElement('div');
    newMessage.className = 'message other-message';
    newMessage.innerHTML = `
      <div class="message-text">${langData.automatically}</div>
      <div class="message-time">10:33</div>
    `;
    chatContainer.appendChild(newMessage);

    typingIndicator.style.display = 'none';
  }, 5000);
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
  initLanguageToggle();
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