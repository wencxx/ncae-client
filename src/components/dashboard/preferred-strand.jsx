import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form"; // ✅ Keep this
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/auth/auth-context";

function PreferredStrand({ openPreffered, setOpenPreffered, items }) {
  const { getUserData } = useAuth();

  const form = useForm({
    defaultValues: {
      items: [],
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (data.items.length != 3)
      return toast.warning("Select three(3) preffered strands", {
        position: "top-center",
      });

    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_ENDPOINT}strands/add-preffered`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        getUserData();
        toast.success("Selected strand successfully");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openPreffered} onOpenChange={setOpenPreffered}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select three(3) preferred strand</DialogTitle>
          <DialogDescription>
            Please select three(3)preffered strands to take examinations.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Sidebar</FormLabel>
                    <FormDescription>
                      Select the items you want to display in the sidebar.
                    </FormDescription>
                  </div>
                  {items.length &&
                    items.map((item) => (
                      <FormField
                        key={item._id}
                        control={form.control}
                        name="items"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item._id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item._id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item._id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item._id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.strandName}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={`float-end ${loading && "animate-pulse"}`}
              disabled={loading}
            >
              {loading ? "Submitting" : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PreferredStrand;
