/**
 * Created by MeiLeLe19 on 2018/4/26.
 */
var vm = new Vue({
  el: "#app",
  data: {
    toggle: {
      isCheck: true,
    },

    // 需要保存用到的字段都放置在 saveData 中
    saveData: {
      username: '',
      password: '',
      rePassword: '',
      sex: 1,
      clothes: 0,
    },
    // 错误语句 0表示验证通过
    langErrorTips: {
      username: {
        1: '请输入用户名',
      },
      password: {
        1: '请输入密码',
      },
      rePassword: {
        1: '二次密码不一致',
      },
      clothes: {
        1: '请选择领取物品',
        2: '您不能领取该物品',
      }
    },
    verifyFields: {
      username: 'require',
      password: 'require',
      rePassword: function (that) {
        if(that.saveData.password !== that.saveData.rePassword) {
          return 1;
        }
        return 0;
      },
      // 多重条件验证
      clothes: [
          function (that) {
            if(that.saveData.clothes == 0) {
              return 1;
            }
            return 0;
          },
        function (that) {
          if(
              (that.saveData.clothes == 1 && that.saveData.sex == 2) ||
              (that.saveData.clothes == 2 && that.saveData.sex == 1)
          ) {
            return 2;
          }
          return 0;
        },
      ],

    },
    errorTips: {},

    groupSex: [
      { raidoText: '男', radioVal: 1 },
      { raidoText: '女', radioVal: 2 },
    ],

    groupClothes: [
      { optionText: '请选择', optionVal: 0 },
      { optionText: '西装', optionVal: 1 },
      { optionText: '裙子', optionVal: 2 },
    ]
  },
  created: function () {
    // 为 errorTips 赋值
    this.errorTips = this.copyField(this.verifyFields);
  },
  methods: {
    // 验证方法
    verify: function (field, verifyFields) {
      if (!verifyFields[field]) return;
      var errCode = 0,
          isChecked = true;

      switch (this.getType(verifyFields[field])) {
        case 'String':
          // 非空判断
          if (verifyFields[field] == 'require') {
            if (!this.saveData[field]) {
              errCode = 1;
              isChecked = false;
            }
          }
          break;
        case 'Function':
          errCode = verifyFields[field](this);
          if (errCode > 0) {
            isChecked = false;
          }
          break;
        case 'Array':
          for (var i = 0; i < verifyFields[field].length; i++) {
            if (verifyFields[field][i] && this.getType(verifyFields[field][i]) === 'Function') {
              errCode = verifyFields[field][i](this);
              if (errCode > 0) {
                isChecked = false;
                break;
              }
            }
          }
          break;
      }

      this.setErrorTips(field, errCode);
      this.setIsChecked(isChecked);
    },

    beforeSave: function () {
      var verifyFields = this.verifyFields;
      this.toggle.isChecked = true;

      for(var field in verifyFields) {
        this.verify(field, verifyFields)
      }
    },

    // 设置错误提示语句
    setErrorTips: function (field, errCode) {
      this.errorTips[field] = errCode === 0 ? '' : this.langErrorTips[field][errCode];
    },

    // setIsCheck
    setIsChecked: function (checked) {
      if(!this.toggle.isChecked) return;
      this.toggle.isChecked = checked;
    },

    updateData: function (field, val) {
      this.saveData[field] = val;
      // 实时验证
      this.verify(field, this.verifyFields);
    },

    // 保存
    save: function () {
      this.beforeSave();
      var self = this;
      // 验证通过提交数据
      if (this.toggle.isChecked) {
        console.log(this.handleSaveData());
      }
    },

    // 处理需要保存的数据
    handleSaveData: function () {
      var saveData = this.saveData;
      var data = {};

      for(var field in saveData) {
        switch (field) {
          default:
            data[field] = saveData[field];
            break;
        }
      }

      return data;
    },

    // 获取类型
    getType: function (obj) {
      return Object.prototype.toString.call(obj).slice(8, -1);
    },

    // 用于复制字段
    copyField: function (obj, val) {
      var o = {};
      for (var field in obj) {
        o[field] = val != undefined ? val : '';
      }

      return o;
    },
  }
})