import CampaignDataTable from "@/components/campaigns/data-table"
import { SearchInput } from "@/components/inputs/search-input"

export default function Page() {
  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="border-b border-border pb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Manage Campaigns
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your campaigns and their associated data
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}

      <section className="space-y-4">
        <form className="flex w-[500px]">
          <SearchInput
            className="w-[500px] transition-all focus-within:ring-2 focus-within:ring-ring"
            placeholder="Find campaign by name..."
          />
        </form>

        {/* Table Section */}

        <CampaignDataTable />
      </section>
    </div>
  )
}
