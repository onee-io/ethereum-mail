<template>

	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
		<template #title>
			<a-row type="flex" align="middle">
				<a-col :span="24" :md="12">
					<h5 class="font-semibold m-0">{{ title }}</h5>
				</a-col>
			</a-row>
		</template>
		<a-table :columns="columns" :data-source="data" :pagination="false">

			<template slot="from" slot-scope="from">
				<div class="table-avatar-info">
					<div class="avatar-info">
						<h6>{{ from }}</h6>
						<!-- <p>{{ from }}</p> -->
					</div>
				</div>
			</template>

			<template slot="mail" slot-scope="mail">
				<div class="table-avatar-info">
					<div class="avatar-info">
						<h6>{{ mail.subject }}</h6>
						<p>{{ mail.content }}</p>
					</div>
				</div>
			</template>
			
		</a-table>
	</a-card>
	<!-- / Authors Table Card -->

</template>

<script>

	export default ({
		props: {
			title: {
				type: String,
				default: () => "Mail Table",
			},	
			data: {
				type: Array,
				default: () => [],
			},
			columns: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {
				// Active button for the "Authors" table's card header radio button group.
				authorsHeaderBtns: 'all',
			}
		},
	})

</script>