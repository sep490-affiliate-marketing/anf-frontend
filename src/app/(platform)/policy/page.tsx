'use client'

import { useGetPolicies } from "@/hooks/policy"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/spinner"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
import { useEffect, useState } from "react"
  

export default function PolicyPage() {
    
    const { data, isLoading, isError, refetch } = useGetPolicies()
    const [openItems, setOpenItems] = useState<string[]>([]);

    useEffect(() => {
        if (data?.value?.data) {
          setOpenItems(data.value.data.map((policy) => policy.id.toString()));
        }
      }, [data?.value?.data]);
    const handleRefresh = () => {
        refetch()
      }
      

    const policies = data?.value?.data || []

    function handleExpandAccordionContent(id: string) {
          setOpenItems([id]);
      }

    return (
        <div>
            <Card className="w-full overflow-hidden rounded-lg bg-white shadow-md">
            <CardHeader className="border-b border-gray-200 bg-gray-50 p-4">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Policy
            </h1>
            {/* <div className="flex items-center justify-between py-4">
                <Button onClick={handleRefresh} className="btn btn-primary">
                    Refresh
                </Button>
            </div> */}
            </CardHeader>
            <section className="space-y-4">
                {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="text-center">
                                <Spinner />
                              </div>
                            </div>
                          ) : isError ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="text-center">
                                <p className="text-sm text-destructive">Error loading data</p>
                                <Button
                                  onClick={handleRefresh}
                                  variant="outline"
                                  className="mt-4"
                                >
                                  Retry
                                </Button>
                              </div>
                            </div>
                          )  : (                         
                                <CardContent className="w-full p-6">
                                    <div className="flex w-full">
                                        <div className="pr-4">
                                        <Command>
                                            <CommandList className="overflow-hidden">
                                                <CommandEmpty >No results found.</CommandEmpty>
                                                <CommandGroup heading="policy Name">
                                                {policies.map((policy) => ( 
                                                <CommandItem 
                                                    key={policy.id}
                                                    onSelect={() => {
                                                        handleExpandAccordionContent(policy.id.toString())
                                                    }}
                                                >
                                                    <span>{policy.header}</span>
                                                </CommandItem>
                                                ))} 
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                        </div>
                                        <div className="flex flex-1">
                                        <div className="mr-4 w-px bg-gray-300" />
                                        {/* show all */}
                                            <Accordion
                                                value={openItems}
                                                onValueChange={setOpenItems}
                                                type="multiple" 
                                                className="w-full"  
                                            >
                                                {policies.map((policy) => (
                                                <>
                                                    <AccordionItem value={policy.id.toString()} key={policy.id} >
                                                        <AccordionTrigger>{policy.header}</AccordionTrigger>
                                                        <AccordionContent>
                                                        {policy.description}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </>
                                                ))}
                                            </Accordion>
                                        </div>
                                    </div>
                                </CardContent>
                            
                          )}
            </section>
            </Card>
        </div>
    )
}