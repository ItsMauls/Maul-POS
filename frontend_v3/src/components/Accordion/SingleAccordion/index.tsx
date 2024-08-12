import { cn } from "@/lib/cn";
import * as Accordion from '@radix-ui/react-accordion';
import { AccordionContentProps, AccordionItemProps } from "@radix-ui/react-accordion";
import React from "react";
import { CustomAccordionContentProps, CustomAccordionTriggerProps } from "../type";
import { SingleAccordionTypes } from "./type";
import { FaCaretDown } from "react-icons/fa6";

export const SingleAccordion = ({
  trigger,
  content
}: SingleAccordionTypes) => (
  <Accordion.Root
    className="bg-mauve6 rounded-md shadow-[0_2px_10px] shadow-black/5"
    type="single"
    defaultValue="item-1"
    collapsible
  > 
    <AccordionItem value="item">
      <AccordionTrigger>{trigger}</AccordionTrigger>
      <AccordionContent>
        {content}
      </AccordionContent>
    </AccordionItem>
  </Accordion.Root>
);

const AccordionItem = React.forwardRef(({ children, className, ...props }: AccordionItemProps, forwardedRef: any) => (
  <Accordion.Item
    className={cn(
      'focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10',
      className  
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </Accordion.Item>
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<HTMLButtonElement, CustomAccordionTriggerProps>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      className={cn(
        'text-violet11 shadow-mauve6 hover:bg-mauve2 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none  outline-none',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <FaCaretDown
        className="text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </Accordion.Trigger>
  </Accordion.Header>
));

const AccordionContent = React.forwardRef(({ children, className, ...props }: CustomAccordionContentProps, forwardedRef: any) => (
  <Accordion.Content
    className={cn(
      'text-mauve11 bg-mauve2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className="py-[15px] px-5">{children}</div>
  </Accordion.Content>
));
AccordionContent.displayName = 'AccordionContent';
