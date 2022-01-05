<!-- 
	This is the sent page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
	<div>
		<!-- Sent Table -->
		<a-row :gutter="24" type="flex">
			<a-col :span="24" class="mb-24">
				<CardMailTable
                    title="Sent"
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
			async loadSent() {
				let provider = this.$store.state.provider;
				if (provider == null) {
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
				let sentBox = await contract.sentBox();
				console.log(sentBox);
				sentBox.forEach(mail => {
					this.tableData.push({
						key: mail.id.toString(),
						from: mail.from,
						mail: {
							subject: mail.subject,
							content: mail.content
						},
						timestamp: mail.timestamp.toString()
					});
				});
			}
		},
		created() {
			this.loadSent();
		}
	})
</script>

<style lang="scss">
</style>