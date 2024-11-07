//combobox from https://headlessui.com/react/combobox

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import clsx from 'clsx';


const categories = [
    { id: 1, name: 'Entreprenuership' },
    { id: 2, name: 'Technology' },
    { id: 3, name: 'Humanity' },
    { id: 4, name: 'Art' },
    { id: 5, name: 'Well being' },
    { id: 6, name: 'Community' },
    { id: 7, name: 'Business' },
    { id: 8, name: 'Professional Development' },
  ]


function CategorySelect(){

    const [selected, setSelected] = useState(categories[0])
    const [query, setQuery] = useState('')

    const filteredcategories =
    query === ''
      ? categories
      : categories.filter((category) => {
          return category.name.toLowerCase().includes(query.toLowerCase())
        })

        return (
            <div className="mx-auto h-screen w-52 pt-20">
              <Combobox value={selected} onChange={(value) => setSelected(value)} onClose={() => setQuery('')}>
                <div className="relative">
                  <ComboboxInput
                    className={clsx(
                      'w-full rounded-lg border-2 bg-gray-500/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
                      'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                    )}
                    displayValue={(person) => person?.name}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                    <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white justify-center" />
                  </ComboboxButton>
                </div>
        
                <ComboboxOptions
                  anchor="bottom"
                  transition
                  className={clsx(
                    'w-[var(--input-width)] rounded-xl border border-gray-600/5 bg-gray-500/5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                    'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                  )}
                >
                  {filteredcategories.map((person) => (
                    <ComboboxOption
                      key={person.id}
                      value={person}
                      className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                    >
                      <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                      <div className="text-sm/6 text-black">{person.name}</div>
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              </Combobox>
            </div>
          )
        }

export default CategorySelect;