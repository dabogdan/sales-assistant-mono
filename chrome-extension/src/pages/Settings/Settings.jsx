import {
  ConcernAdviceTable,
  BusinessTypeInput,
  ConcernsList,
  CommonError,
} from "@/components";

export function Settings() {
  return (
    <>
      <BusinessTypeInput />
      <ConcernsList />
      <ConcernAdviceTable />
      <CommonError />
    </>
  );
}
