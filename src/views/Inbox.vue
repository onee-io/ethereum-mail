<!-- 
	This is the inbox page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
	<div>
		<!-- Inbox Table -->
		<a-row :gutter="24" type="flex">
			<a-col :span="24" class="mb-24">
				<CardMailTable
                    title="Inbox"
					:data="tableData"
					:columns="tableColumns"
				></CardMailTable>
			</a-col>
		</a-row>
	</div>
</template>

<script>
	import { ethers } from "ethers";
	import MailServiceArtifact from "../contracts/MailService.json";
	import contractAddress from "../contracts/contract-address.json";
	import {formatDate} from '@/common/date'

	import CardMailTable from '../components/Cards/CardMailTable' ;

	// 表头
	const tableColumns = [
		{
			title: 'FROM',
			dataIndex: 'from',
			scopedSlots: { customRender: 'from' },
			width: 400
		},
		{
			title: 'SUMMARY',
			dataIndex: 'mail',
			scopedSlots: { customRender: 'mail' },
		},
		{
			title: 'DATE',
			dataIndex: 'timestamp',
			class: 'text-muted',
			width: 200
		},
	];

	export default ({
		components: {
            CardMailTable
		},
		data() {
			return {
				tableData: [],
				tableColumns: tableColumns
			}
		},
		methods: {
			// 加载收件箱
			async loadInbox() {
				let provider = this.$store.state.provider;
				if (provider == null) {
					this.tableData = [];
					console.log("未连接钱包 无法加载收件箱");
					return;
				}
				// 加载合约
				let contract = new ethers.Contract(
					contractAddress.MailService,
					MailServiceArtifact.abi,
					provider.getSigner(0)
				);
				// 调用合约
				let inbox = await contract.inbox();
				console.log("load inbox", inbox);
				this.tableData = [];
				for (let i = inbox.length - 1; i >= 0; i--) {
					let mail = inbox[i];
					let date = new Date()
              		date.setTime(Number(mail.timestamp.toString()) * 1000);
					this.tableData.push({
						key: mail.id.toString(),
						from: mail.from,
						mail: {
							subject: mail.subject,
							content: mail.content
						},
						timestamp: formatDate(date, 'yyyy-MM-dd HH:mm:ss')
					});
				}
				this.$store.commit("setInboxRefresh", false);
			}
		},
		created() {
			this.loadInbox();
		},
		watch: {
			'$store.state.inboxRefresh'() {
				let isRefresh = this.$store.state.inboxRefresh;
				console.log("watch inboxRefresh change", isRefresh);
				if (isRefresh) {
					this.loadInbox();
				}
			}
		}
	})
</script>

<style lang="scss">
</style>