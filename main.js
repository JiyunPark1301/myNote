// * 모달 여는 버튼
const openModalBtn = document.querySelector('.add-note-btn');
// * 모달 바깥 검정 영역
const modalOverlay = document.querySelector('.modal-overlay');
// * 모달
const modal = document.querySelector('.modal');
// * 모달 닫는 버튼
const closeModalBtn = modal.querySelector('.modal-close');
// * 모달 내 노트 추가 버튼
const addNoteBtn = modal.querySelector('.modal-add');
// * 모달 내 제목입력창
const titleInput = modal.querySelector('.note-title-input');
// * 모달 내 내용입력창
const contentInput = modal.querySelector('.note-content-input');
// * 모달 내 핀버튼
const modalPinBtn = modal.querySelector('.pin');
// * 모달 내 컬러픽커 버튼
const modalColorBtn = modal.querySelector('.color-select');
// * 모달 내 삭제 버튼
const modalDeleteBtn = modal.querySelector('.delete');
// * 핀노트, 노트 목록
const noteLists = document.querySelectorAll('.note-container');
// * 핀된 노트가 0개임을 알려주는 메세지
const zeroPinnedMessage = document.querySelector('.zeroPinnedMessage');
// * 노트가 0개임을 알려주는 메세지
const zeroNoteMessage = document.querySelector('.zeroNoteMessage');

let notes;
let isEditMode = false;
let currentBgColor = '#fff';
let isPinned = false;
let currentId = null;
let picked = null;

// ? 추가모드와 수정모드일 때 모달 UI 변경
const changeUIInModal = () => {
  if (isEditMode) {
    modalDeleteBtn.classList.remove('hidden');
    addNoteBtn.textContent = '수정';
  } else {
    modalDeleteBtn.classList.add('hidden');
    addNoteBtn.textContent = '추가';
  }
};

// ? 모드 변경(추가 or 수정)
const changeMode = (value) => {
  isEditMode = Boolean(value);
};

// ? 현재 선택한 노트가 무엇인지 알기 위해 id설정
const setId = (noteId) => {
  currentId = noteId;
};

// ? 모달에 선택한 노트 데이터 가져오기
const getDataToModal = () => {
  const index = notes.findIndex((note) => note.id === currentId);
  const { title, content, pinned, bgColor } = notes[index];

  setInputsInModal(title, content);
  setPinnedInModal(pinned);
  setBgColorInModal(bgColor);
};

// ? 모달 열기
const openModal = () => {
  changeUIInModal();
  modalOverlay.classList.remove('hidden');
};

// ? 모달 닫기
const closeModal = () => {
  modalOverlay.classList.add('hidden');
  setInputsInModal('', '');
  setPinnedInModal(false);
  setBgColorInModal('#fff');
};

// ? 모달에서 핀 상태 토글
const togglePinBtnInModal = () => {
  if (modalPinBtn.classList.contains('black')) {
    setPinnedInModal(false);
  } else {
    setPinnedInModal(true);
  }
};

// ? 모달 내 핀 상태 변경
const setPinnedInModal = (value) => {
  isPinned = Boolean(value);

  if (isPinned) {
    modalPinBtn.classList.add('black');
  } else {
    modalPinBtn.classList.remove('black');
  }
};

// ? 모달 내 색상 변경
const setBgColorInModal = (value) => {
  currentBgColor = value;
  modalColorBtn.style.backgroundColor = currentBgColor;
};

// ? 모달 내 입력창 변경
const setInputsInModal = (title, content) => {
  titleInput.value = title;
  contentInput.value = content;
};

// ? 핀노트, 노트 개수 확인 -> 메세지 숨김 처리
const checkNumOfNotes = () => {
  if (notes.filter((note) => note.pinned).length === 0) {
    zeroPinnedMessage.classList.remove('hidden');
  } else {
    zeroPinnedMessage.classList.add('hidden');
  }

  if (notes.filter((note) => !note.pinned).length === 0) {
    zeroNoteMessage.classList.remove('hidden');
  } else {
    zeroNoteMessage.classList.add('hidden');
  }
};

// ? 현재 상태의 순서를 로컬 스토리지에 저장하기 위함
const changeOrderOfNotes = () => {
  const pinnedList = [...noteLists[0].children].map(
    (li) => li.firstElementChild.dataset.id
  );
  const notPinnedList = [...noteLists[1].children].map(
    (li) => li.firstElementChild.dataset.id
  );
  const idList = [...pinnedList, ...notPinnedList];
  return idList.map((id) => notes.find((note) => note.id === id));
};

// ? 새 노트 그려줌
const renderNote = (note) => {
  const { id, title, content, pinned, bgColor } = note;
  const li = document.createElement('li');
  li.className = 'note-item';
  li.setAttribute('draggable', true);
  const article = document.createElement('article');
  article.className = 'note';
  article.dataset.id = id;
  const div = document.createElement('div');
  div.className = 'note-top';
  const h3 = document.createElement('h3');
  h3.className = 'note-title ellipsis';
  h3.innerText = title;
  const p = document.createElement('p');
  p.className = 'note-content multi-ellipsis';
  p.innerText = content;
  const footer = document.createElement('footer');
  footer.className = 'note-footer';
  footer.innerHTML = `
    <button class="pin ${pinned ? 'black' : ''}" type="button">
      <i class="fa-solid fa-thumbtack"></i>
    </button>
    <button class="color-select" type="button">
      <input class="color-picker" type="color" />
      <i class="fa-solid fa-palette"></i>
    </button>
    <button class="delete" type="button">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;
  div.append(h3, p);
  article.append(div, footer);
  li.append(article);

  pinned ? noteLists[0].append(li) : noteLists[1].append(li);
  div.style.backgroundColor = bgColor;
};

// ? 모달 내 입력창 유효성 검사
const checkValidityOfInputs = () => {
  if (titleInput.value.trim() === '' || contentInput.value.trim() === '') {
    alert('제목이나 내용을 적어주세요');
    return false;
  }
  return true;
};

// ? 새 노트 추가
const addNote = () => {
  const title = titleInput.value;
  const content = contentInput.value;

  const newNote = {
    id: Date.now().toString(),
    title,
    content,
    pinned: isPinned,
    bgColor: currentBgColor,
  };

  notes.push(newNote);
  localStorage.setItem('notes', JSON.stringify(notes));

  closeModal();
  renderNote(newNote);
  checkNumOfNotes();
};

// ? 수정된 제목, 내용 렌더링
const renderEditedNote = (title, content) => {
  const note = document.querySelector(`article[data-id='${currentId}']`);
  note.querySelector('.note-title').innerText = title;
  note.querySelector('.note-content').innerText = content;
};

// ? 수정된 핀 상태 렌더링
const renderEditedPin = () => {
  const pinBtn = document.querySelector(`article[data-id='${currentId}'] .pin`);
  const li = pinBtn.closest('.note-item');
  li.remove();
  if (isPinned) {
    noteLists[0].append(li);
    pinBtn.classList.add('black');
  } else {
    noteLists[1].append(li);
    pinBtn.classList.remove('black');
  }
};

// ? 수정된 배경색 렌더링
const renderEditedColor = () => {
  const div = document.querySelector(
    `article[data-id='${currentId}'] .note-top`
  );
  div.style.backgroundColor = currentBgColor;
};

// ? 노트 수정
const editNote = () => {
  const title = titleInput.value;
  const content = contentInput.value;

  const index = notes.findIndex((note) => note.id === currentId);
  notes[index].title = title;
  notes[index].content = content;
  notes[index].bgColor = currentBgColor;

  if (isPinned && !notes[index].pinned) {
    notes[index].pinned = true;
    renderEditedPin();
  }
  if (!isPinned && notes[index].pinned) {
    notes[index].pinned = false;
    renderEditedPin();
  }

  renderEditedNote(title, content);
  renderEditedColor();

  notes = changeOrderOfNotes();
  localStorage.setItem('notes', JSON.stringify(notes));

  closeModal();
  checkNumOfNotes();
};

// ? 노트 삭제 할 것인지 확인
const confirmDeletionOfNote = () => {
  if (confirm('정말 삭제하시겠습니까?')) return true;
  return false;
};

// ? 삭제된 노트 렌더링
const renderRemainedNotes = () => {
  const li = document.querySelector(
    `article[data-id='${currentId}']`
  ).parentElement;
  li.remove();
};

// ? 노트 삭제
const deleteNote = () => {
  const index = notes.findIndex((note) => note.id === currentId);
  notes.splice(index, 1);

  renderRemainedNotes();

  localStorage.setItem('notes', JSON.stringify(notes));
  checkNumOfNotes();
};

// ? 메인화면에서 노트 핀 상태 변경 및 렌더링
const pinNote = (pinBtn) => {
  const index = notes.findIndex((note) => note.id === currentId);
  notes[index].pinned = notes[index].pinned ? false : true;

  const li = pinBtn.closest('.note-item');
  li.remove();
  if (notes[index].pinned) {
    noteLists[0].append(li);
    pinBtn.classList.add('black');
  } else {
    noteLists[1].append(li);
    pinBtn.classList.remove('black');
  }

  notes = changeOrderOfNotes(notes);
  localStorage.setItem('notes', JSON.stringify(notes));
  checkNumOfNotes();
};

// ? 메인화면에서 노트 배경 색 변경 및 렌더링
const changeBgColor = (bgBtn) => {
  const index = notes.findIndex((note) => note.id === currentId);
  const color = bgBtn.firstElementChild.value;

  notes[index].bgColor = color;
  localStorage.setItem('notes', JSON.stringify(notes));
  bgBtn.closest('.note-footer').previousElementSibling.style.backgroundColor =
    color;
};

openModalBtn.addEventListener('click', () => {
  changeMode(false);
  openModal();
});
modalOverlay.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => e.stopPropagation());
closeModalBtn.addEventListener('click', closeModal);
addNoteBtn.addEventListener('click', () => {
  if (!checkValidityOfInputs()) return;
  if (isEditMode) return editNote();
  addNote();
});
modalPinBtn.addEventListener('click', togglePinBtnInModal);
modalColorBtn.addEventListener('input', () => {
  const value = modalColorBtn.firstElementChild.value;
  setBgColorInModal(value);
});
modalDeleteBtn.addEventListener('click', () => {
  if (!confirmDeletionOfNote()) return;
  deleteNote();
  closeModal();
});

noteLists.forEach((noteList) => {
  noteList.addEventListener('click', (e) => {
    const note = e.target.closest('.note');
    if (!note) return;

    setId(note.dataset.id);

    if (e.target.closest('.delete')) {
      if (confirmDeletionOfNote()) deleteNote();
      return;
    }
    const pinBtn = e.target.closest('.pin');
    if (pinBtn) return pinNote(pinBtn);
    if (e.target.closest('.color-select')) return;

    changeMode(true);
    openModal();
    if (isEditMode) getDataToModal();
  });

  noteList.addEventListener('input', (e) => {
    const bgBtn = e.target.closest('.color-select');
    if (bgBtn) {
      const note = bgBtn.closest('.note');
      setId(note.dataset.id);
      changeBgColor(bgBtn);
    }
  });

  noteList.addEventListener('dragstart', (e) => {
    const li = e.target.closest('.note-item');
    if (!li) return;
    picked = li;
    setId(li.children[0].dataset.id);
  });
  noteList.addEventListener('dragend', (e) => {
    const li = e.target.closest('.note-item');
    if (!li) return;
    picked = null;
  });
  noteList.addEventListener('dragover', (e) => {
    e.preventDefault();
    // console.log(picked.getBoundingClientRect().left);
  });
  noteList.addEventListener('drop', (e) => {
    const li = e.target.closest('li');
    console.log(li.getBoundingClientRect().left);

    if (e.target.closest('.note-container') && !li) {
      e.currentTarget.appendChild(picked);
    } else {
      if (!li) return;
      if (li.getBoundingClientRect().left < e.clientX) {
        li.before(picked);
      } else {
        li.after(picked);
      }
    }

    const index = notes.findIndex((note) => note.id === currentId);

    if (notes[index].pinned && noteList === noteLists[1]) {
      notes[index].pinned = false;
      picked.querySelector('.pin').classList.remove('black');
    } else if (!notes[index].pinned && noteList === noteLists[0]) {
      notes[index].pinned = true;
      picked.querySelector('.pin').classList.add('black');
    }

    notes = changeOrderOfNotes();
    localStorage.setItem('notes', JSON.stringify(notes));

    checkNumOfNotes();
  });
});

const renderAllNotes = () => {
  checkNumOfNotes();
  notes.forEach((note) => renderNote(note));
};

const init = () => {
  notes = JSON.parse(localStorage.getItem('notes'));
  notes = notes ?? [];

  renderAllNotes();
};

init();
