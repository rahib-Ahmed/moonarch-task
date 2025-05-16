import { rootAPI } from "./rootApi";

export const statsDataApi = rootAPI.injectEndpoints({
	endpoints: (builder) => ({
		getLocations: builder.query({
			query: () => ({
				url: '',
				params: {
					drilldowns: "State",
					measures: "Population",
					year: "latest"
				},
			}),
			providesTags: ["StatsData"],
			transformResponse: (response) => {
				const locations = response?.data?.map((location) => ({
					value: location['ID State'],
					label: location?.State,
					slug: location['Slug State'],
				}));
				return locations;
			}
		}),
		getPopulation: builder.query({
			query: (param) => ({
				url: '',
				params: {
					...(param?.geography !== 'Nation' && { Geography: param?.geography }),
					drilldowns: param?.drilldowns,
					measure: "Population",
					...(param.year !== 'latest' && { year: param.year })
				}
			}),
			transformResponse: (response) => {
				const populationData = response?.data.map((populationData) => ({
					id: populationData['ID Nation'] ?? populationData['Geography'],
					population: populationData['Population'],
					year: populationData['Year']
				}))
				return populationData;
			}
		})
	}),
})

export const {
	useGetLocationsQuery,
	useGetPopulationQuery,
} = statsDataApi;
