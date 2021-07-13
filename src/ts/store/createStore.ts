import { Action, GlobalState, Reducer, Store } from '../types';

const GLOBAL_STATE = 'globalState';

const localSearchList = JSON.parse(window.localStorage.getItem('searchList'));
const localSaveVideoList = JSON.parse(window.localStorage.getItem('saveVideoList'));

// 라이브러리로써 사용한다면 reducer파일에 있는게 맞지만 현재는 제가 만들어쓰는 한정된 함수로써 취급하였습니다.
let INITIAL_STATE: GlobalState = {
  isSearchLoading: false,
  error: null,
  searchList: localSearchList ?? [],
  recentSearchKeywords: [],
  saveVideoList: localSaveVideoList ?? [],
  currentSearchInfo: {
    nextPageToken: '',
    keyword: '',
  },
  isModalOpen: false,
};

const createStore = (reducer: Reducer): Store => {
  let listeners: Function[] = [];

  let state = Object.freeze(reducer(INITIAL_STATE, { type: null }));

  const subscribe = (newListener: Function) => {
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter(listener => listener !== newListener);
    };
  };

  const invokeListeners = () => {
    listeners.forEach(listener => listener(state));
  };

  const dispatch = (action: Action) => {
    const newState = reducer(state, action);

    if (!newState) throw new Error('리듀서 함수는 항상 상태값을 반환해야합니다.');

    if (state === newState) return;

    state = Object.freeze(newState);

    invokeListeners();
  };

  return {
    subscribe,
    dispatch,
    getState: () => state,
  };
};

export default createStore;
