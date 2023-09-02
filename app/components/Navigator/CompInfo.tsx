'use client';
import {Popover} from "@headlessui/react";

const CompInfo = () => {
  return (
    <Popover className="relative w-full">
      <Popover.Button className={'text-xs p-2 hover:bg-gray-200 rounded w-full text-start'}> ©{new Date().getFullYear()}, ABANDON INC.</Popover.Button>
      <Popover.Panel className="absolute z-10 bottom-10 w-full border">
        <div className="bg-white p-2 rounded text-xs">
          8 The Green, STE R.
          Dover DE 19901.
          United States
          <br/>
          <br/>
          <a href={'mailto:support@abandon.ai'} className={'underline font-semibold'}>support@abandon.ai</a>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default CompInfo