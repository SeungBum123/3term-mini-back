"use strict";

const BoardStorage = require("./BoardStorage");

class Board {
  constructor(req) {
    this.params = req.params;
    this.body = req.body;
  }
  //2팀
  async boardAll() {
    return await BoardStorage.findAllByBoards();
  }
  async findOneByBoard() {
    const boardNo = this.body;

    try {
      const response = await BoardStorage.findOneByBoardNo(no);

      return response[0][0];
    } catch (err) {
      return { success: false, msg: err };
    }
  }
  async deleteBoard(req) {
    const no = req.params.no;
    try {
      const response = await BoardStorage.deleteBoard(no);

      return response;
    } catch (err) {
      return { success: false, msg: err };
    }
  }

  //1팀
  async nonUserBoardConnect() {
    try {
      const boardNo = this.params;
      const board = await BoardStorage.selectBoardToNonUser(boardNo);
      const comment = await BoardStorage.selectBoardCmt(boardNo);

      if (board.success && comment.success) {
        return {
          success: true,
          board: board.data[0],
          comments: comment.comments,
          msg: "비회원: 게시글 접속 성공",
        };
      } else if (!comment.success) {
        return {
          success: true,
          board: board.data[0],
          msg: "비회원: 게시글 접속 성공(댓글 X)",
        };
      } else {
        return {
          success: false,
          msg: "비회원 : 해당 게시글이 존재하지 않습니다.",
        };
      }
    } catch (err) {
      return { err };
    }
  }

  async userBoardConnect() {
    const boardNo = this.params;
    try {
      const board = await BoardStorage.selectBoardToUser(boardNo);
      const comment = await BoardStorage.selectBoardCmt(boardNo);

      if (board.success) {
        if (
          board.boardInfo[0].boardWriteUserNo === Number(boardNo.userNo) &&
          comment.success
        ) {
          return {
            success: true,
            boardData: board.boardInfo[0],
            comments: comment.comments,
            boardWriter: true,
            msg: "회원 : 게시글 접속 성공",
          };
        } else if (
          board.boardInfo[0].boardWriteUserNo === Number(boardNo.userNo) &&
          !comment.success
        ) {
          return {
            success: true,
            boardData: board.boardInfo[0],
            boardWriter: true,
            msg: "회원 : 게시글 접속 성공(댓글 X)",
          };
        } else if (
          board.boardInfo[0].boardWriteUserNo !== Number(boardNo.userNo) &&
          comment.success
        ) {
          return {
            success: true,
            boardData: board.boardInfo[0],
            comments: comment.comments,
            boardWriter: false,
            msg: "회원 : 게시글 접속 성공(댓글 O, 작성자 X)",
          };
        } else {
          return {
            success: true,
            boardData: board.boardInfo[0],
            boardWriter: false,
            msg: "회원 : 게시글 접속 성공(댓글 X, 작성자 X)",
          };
        }
      } else {
        return {
          success: false,
          msg: "회원 : 해당 게시글이 존재하지 않습니다.",
        };
      }
    } catch (err) {
      return { success: false, msg: err };
    }
  }

  async boardCreate() {
    const boardWrite = this.body;

    if (
      !boardWrite.title.replace(/^\s+|\s+$/gm, "").length ||
      !boardWrite.description.replace(/^\s+|\s+$/gm, "").length
    ) {
      return {
        success: false,
        msg: "제목 또는 내용을 입력해주세요",
      };
    }

    try {
      const response = await BoardStorage.createBoard(boardWrite);

      if (response.success) {
        return {
          success: true,
          msg: "게시물 등록 성공",
        };
      } else {
        return { success: false, msg: "게시물 등록 실패" };
      }
    } catch (err) {
      return { success: false, msg: err };
    }
  }

  async boardUpdate() {
    const boardWrite = this.body;

    if (
      !boardWrite.title.replace(/^\s+|\s+$/gm, "").length ||
      !boardWrite.description.replace(/^\s+|\s+$/gm, "").length
    ) {
      return {
        success: false,
        msg: "제목 또는 내용을 입력해주세요.",
      };
    }

    try {
      const board = await BoardStorage.updateBoard(boardWrite);

      if (board.success) {
        return { success: true, msg: "게시글 수정 완료" };
      } else {
        return {
          success: false,
          msg: "게시글 수정 실패(작성자 X)",
        };
      }
    } catch (err) {
      return { success: false, msg: err };
    }
  }

  async boardByBeforeUpdate() {
    try {
      const userNoOfBoard = this.params;
      const board = await BoardStorage.selectBeforeBoard(userNoOfBoard);

      if (board.success) {
        return {
          success: true,
          boardInfo: board.boardInfo[0],
          msg: "게시글 수정화면 접속 성공",
        };
      } else {
        return { success: false, msg: "해당 게시글이 존재하지 않습니다." };
      }
    } catch (err) {
      return { success: false, msg: err };
    }
  }
}

module.exports = Board;
