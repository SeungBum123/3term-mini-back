"use strict";

const UserStorage = require("./UserStorage");
class User {
  constructor(body) {
    this.body = body;
  }
  async login() {
    const client = this.body;
    try {
      // const { id, password } = await UserStorage.getUserInfo(client.id);
      const userInfo = await UserStorage.getUserInfo(client.id);
      if (userInfo) {
        if (userInfo.password === client.password) {
          return { success: true, msg: "로그인 성공" };
        }
        return { success: false, msg: "비밀번호가 틀렸습니다" };
      }

      return { success: false, msg: "존재하지 않는 아이디입니다." };
    } catch (err) {
      throw { success: false, err };
    }
  }
  async register() {
    const client = this.body;
    //id,psword,이름,이 있는지 부터 확인
    const clientObj = {
      id: client.id,
      password: client.password,
      name: client.name,
      confirm: client.passwordConfirm,
    };
    // if(!(client.id && client.psword && client.name&&client.pswordconfirm)) {
    const nullKeys = Object.keys(clientObj)
      .filter((key) => {
        if (!clientObj[key]) return true;
        return false;
      })
      .join("");

    if (nullKeys)
      return {
        success: false,
        msg: `${nullKeys}에 해당하는 값을 입력해주세요`,
      };
    //password === passwordconfirm확인하는 작업
    if (!(client.password === client.passwordConfirm)) {
      return {
        success: false,
        msg: "비밀번호와 비밀번호 확인이 서로 다릅니다.",
      };
    }
    //body에 nickname값이 없다면 id값을 nickname으로 지정해줌
    if (!client.nickname) {
      client.nickname = client.id;
    }

    //id 중복 시 다른 id로 입력 할 수 있도록.
    try {
      const id = await UserStorage.getUserInfo(client.id);
      return id.length
        ? { success: false, msg: "해당 id는 사용중인 id입니다." }
        : await UserStorage.save(client);
    } catch (err) {
      throw { success: false, err };
    }
  }
}

module.exports = User;
