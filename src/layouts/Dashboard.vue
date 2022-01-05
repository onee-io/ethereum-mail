<!-- 
	This is the dashboard layout, used in dashboard, tables, billing and profile pages.
 -->

<template>
	<div>

		<!-- Dashboard Layout -->
		<a-layout class="layout-dashboard" id="layout-dashboard" :class="[navbarFixed ? 'navbar-fixed' : '', ! sidebarCollapsed ? 'has-sidebar' : '', layoutClass]">
			
			<!-- Main Sidebar -->
			<DashboardSidebar
				:sidebarCollapsed="sidebarCollapsed"
				:sidebarColor="sidebarColor"
				:sidebarTheme="sidebarTheme"
				@toggleSidebar="toggleSidebar"
			></DashboardSidebar>
			<!-- / Main Sidebar -->

			<!-- Layout Content -->
			<a-layout>

				<!-- Layout Header's Conditionally Fixed Wrapper -->
				<DashboardHeader
					:sidebarCollapsed="sidebarCollapsed"
					:navbarFixed="navbarFixed"
					@toggleSettingsDrawer="toggleSettingsDrawer"
					@toggleSidebar="toggleSidebar"
				></DashboardHeader>
				<!-- / Layout Header's Conditionally Fixed Wrapper -->

				<!-- Page Content -->
				<a-layout-content>
					<router-view />
				</a-layout-content>
				<!-- / Page Content -->

				<!-- Layout Footer -->
				<!-- <DashboardFooter></DashboardFooter> -->
				<!-- / Layout Footer -->


				<a-button class="fab" shape="circle" @click="createMail">
					<a-icon  style="color:#666;font-size:18px" type="plus" theme="outlined" />
				</a-button>

				<a-modal 
					v-model="visible" 
					title="New Message" 
					ok-text="Send" 
					:confirmLoading="confirmLoading" 
					@ok="handleOk"
					:destroyOnClose="true">
					<a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
						<a-form-item label="To">
							<a-input v-model="mail.to" />
						</a-form-item>
						<a-form-item label="Subject">
							<a-input v-model="mail.subject" />
						</a-form-item>
						<a-form-item label="Content">
							<a-textarea :rows="4" v-model="mail.content" />
						</a-form-item>
					</a-form>
				</a-modal>

			</a-layout>
			<!-- / Layout Content -->

		</a-layout>
		<!-- / Dashboard Layout -->

	</div>
</template>

<script>

	import { ethers } from "ethers";
	import MailServiceArtifact from "../contracts/MailService.json";
	import contractAddress from "../contracts/contract-address.json";

	import DashboardSidebar from '../components/Sidebars/DashboardSidebar' ;
	import DashboardHeader from '../components/Headers/DashboardHeader' ;
	import DashboardFooter from '../components/Footers/DashboardFooter' ;
	import DashboardSettingsDrawer from '../components/Sidebars/DashboardSettingsDrawer' ;

	export default ({
		components: {
			DashboardSidebar,
			DashboardHeader,
			DashboardFooter,
			DashboardSettingsDrawer,
		},
		data() {
			return {
				// Sidebar collapsed status.
				sidebarCollapsed: false,
				
				// Main sidebar color.
				sidebarColor: "primary",
				
				// Main sidebar theme : light, white, dark.
				sidebarTheme: "light",

				// Header fixed status.
				navbarFixed: true,

				// Settings drawer visiblility status.
				showSettingsDrawer: false,
				
				// 模态框显隐
				visible: false,
				// 新邮件对象
				mail: {
					to: null,
					subject: null,
					content: null
				},
				// 发送按钮加载状态
				confirmLoading: false,
			}
		},
		methods: {
			toggleSidebar( value ) {
				this.sidebarCollapsed = value ;
			},
			toggleSettingsDrawer( value ) {
				this.showSettingsDrawer = value ;
			},
			toggleNavbarPosition( value ) {
				this.navbarFixed = value ;
			},
			updateSidebarTheme( value ) {
				this.sidebarTheme = value ;
			},
			updateSidebarColor( value ) {
				this.sidebarColor = value ;
			},
			createMail() {
				this.visible = true;
			},
			async handleOk(e) {
				// 确认是否已连接钱包
				let provider = this.$store.state.provider;
				if (provider == null) {
					this.$message.error("Please connect to your wallet");
					return;
				}
				this.confirmLoading = true;
				console.log(this.mail);
				// 加载合约
				let contract = new ethers.Contract(
					contractAddress.MailService,
					MailServiceArtifact.abi,
					provider.getSigner(0)
				);
				// 调用合约
				try {
					const tx = await contract.sendMail([this.mail.to], [], this.mail.subject, this.mail.content);
					console.log(tx.hash);
					// 等待交易上链
					const receipt = await tx.wait();
					this.confirmLoading = false;
					this.visible = false;
					// 判断交易结果
					console.log(receipt);
					if (receipt.status === 1) {
						this.$message.success("Sent successfully!");
						this.$store.commit("setInboxRefresh", true);
						this.$store.commit("setSentBoxRefresh", true);
					} else {
						this.$message.error("Fail in send!");
					}
				} catch (error) {
					this.confirmLoading = false;
					if (error.code === 4001) { // 用户拒绝连接钱包
						this.$message.error("User rejected");
					}
					return;
				}
			},
		},
		computed: {
			// Sets layout's element's class based on route's meta data.
			layoutClass() {
				return this.$route.meta.layoutClass ;
			}
		},
	})

</script>
