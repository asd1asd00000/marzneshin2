import { FC } from "react";
import {
  Tabs,
  TabsTrigger,
  TabsContent,
  FormLabel,
} from "@marzneshin/common/components";
import type { UserMutationType } from "@marzneshin/modules/users";
import {
  ExpireDateField,
  ActivationDeadlineField,
  UsageDurationField,
} from "@marzneshin/modules/users/components/dialogs/mutation/fields";
import { TabsList } from "@radix-ui/react-tabs";
import { useTranslation } from "react-i18next";
import { useExpirationMethodTabs } from "./use-expiration-method-tabs";
import { SelectDateView } from "./SelectDateView";
import { useFormContext } from "react-hook-form";

interface ExpirationMethodProps {
  entity: UserMutationType | null;
}

export const ExpirationMethodFields: FC<ExpirationMethodProps> = ({ entity }) => {
  const { t } = useTranslation();
  const form = useFormContext();
  const { handleTabChange, selectedExpirationMethodTab } = useExpirationMethodTabs(entity);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    const setExpirationFromRange = (range: string) => {
      const now = new Date();
      let months = 0;
      switch (range) {
        case "1d": months = 0; break;
        case "7d": months = 0; break;
        case "30d": months = 1; break;
        case "90d": months = 3; break;
        default: months = 1;
      }
      now.setMonth(now.getMonth() + months);

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      form.setValue("expirationDateTime", formattedDateTime);
    };
    if (selectedExpirationMethodTab === "fixed_date") {
      setExpirationFromRange(timeRange);
    }
  }, [timeRange, form, selectedExpirationMethodTab]);

  return (
    <>
      <FormLabel className="text-md">{t("page.users.expire_method")}</FormLabel>
      <Tabs
        defaultValue={selectedExpirationMethodTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex flex-row items-center p-1 w-full rounded-md bg-accent">
          <TabsTrigger className="w-full" value="fixed_date">
            {t("page.users.fixed_date")}
          </TabsTrigger>
          <TabsTrigger className="w-full" value="start_on_first_use">
            {t("page.users.on_first_use")}
          </TabsTrigger>
          <TabsTrigger className="w-full" value="never">
            {t("page.users.never")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="fixed_date">
          <ExpireDateField />
          <div className="mt-2">
            <FormLabel>{t("quick-select-duration")}</FormLabel>
            <SelectDateView timeRange={timeRange} setTimeRange={setTimeRange} />
          </div>
        </TabsContent>
        <TabsContent value="start_on_first_use">
          <UsageDurationField />
          <ActivationDeadlineField />
        </TabsContent>
      </Tabs>
    </>
  );
};
