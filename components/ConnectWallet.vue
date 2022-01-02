<template>
  <div class="background">
    <div class="center">
      <img class="title-img" src="~/assets/ethereum_mail_logo.png">
      <a-button 
        type="dashed" 
        icon="api" 
        shape="round" 
        size="large" 
        :loading="isConnecting"
        @click="connectWallet"
      >
      Connect Wallet
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConnectWallet",
  data () {
    return {
      isConnecting: false,
      accountAddress: null
    }
  },

  methods: {

    // 连接钱包
    async connectWallet() {
      this.isConnecting = true;
      // 检查是否安装 metamask 插件
      if (window.ethereum === undefined) {
        this.$message.warn('请先安装 MetaMask 插件');
        this.isConnecting = false;
        return;
      }

      // 检查网络
      if (!this._checkNetwork()) {
        this.$message.error('错误的网络！请切换到 Ropsten 网络');
        this.isConnecting = false;
        return;
      }

      // 连接钱包
      try {
        const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts'});
        this._initialize(selectedAddress);
      } catch (error) {
        if (error.code === 4001) {
          this.$message.error('用户拒绝');
          this.isConnecting = false;
          return;
        }
      }

      // 监听账户变更事件
      window.ethereum.on("accountsChanged", ([newAddress]) => {
        if (newAddress === undefined) {
          return this._resetAccount();
        }
        this._initialize(newAddress);
      });
      
      // 监听网络变更事件
      window.ethereum.on("chainChanged", ([chainId]) => {
        this._resetAccount();
      });
    },

    // 初始化账户
    _initialize(userAddress) {
      this.accountAddress = userAddress;
      this.isConnecting = false;
      this.$message.success("账户连接成功");
      // TODO 重定向到主页
    },

    // 重置账户
    _resetAccount() {
      this.accountAddress = null;
      // TODO 重定向连接钱包页面
    },

    // 检查连接网路
    _checkNetwork() {
      // return false;
      if (window.ethereum.networkVersion === '3') {
        return true;
      }
      return false;
    }
  }
}
</script>

<style>
.background {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
}
.center {
  margin: auto;
  text-align: center;
}
.title-img {
  display: block;
  margin-bottom: 40px;
  width: 300px;
}
</style>