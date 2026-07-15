"use client";

import { Select } from "../../../src/components/Select";
import { ExchangeType, Keycap, ListingType } from "@prisma/client";
import { Formik, Form, Field, FieldProps, FormikHelpers } from "formik";
import { Loading } from "../../../src/components/Loading";
import { swrFetcher } from "../../../src/util";
import { API_BASE } from "../../../src/const";
import useSWR from "swr";
import { LoadingError } from "../../../src/components/LoadingError";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isUndefined } from "swr/_internal";
import NotFound from "../../not-found";
import { Button } from "../../../src/components/ui";

interface FormData {
  keycap: { label: string; value: string; image: string } | undefined;
  type: string | undefined;
  exchange: string | undefined;
  country?: { label: string; value: string };
  city?: { label: string; value: string };
}

export default function Page() {
  const [selectedKeycap, setSelectedKeycap] = useState<Keycap>();
  const [selectedCountry, setSelectedCountry] = useState<{
    label: string;
    value: string;
  }>();
  const router = useRouter();

  const { data: keycaps, error: keycapsError } = useSWR<Keycap[], Error>(
    "/api/keycap",
    swrFetcher
  );
  const { data: countries, error: countriesError } = useSWR<string[], Error>(
    "/api/country",
    swrFetcher
  );
  const { data: cities, mutate } = useSWR<string[], Error>(
    selectedCountry != undefined && selectedCountry.value != ""
      ? `/api/country/${selectedCountry.value}`
      : null,
    swrFetcher
  );

  if (keycapsError || countriesError) return <LoadingError />;
  if (isUndefined(keycaps) || isUndefined(countries)) return <Loading />;
  if (
    "error" in keycaps ||
    "error" in countries ||
    (!isUndefined(cities) && "error" in cities)
  )
    return <NotFound />;

  const keycapOptions = Object.entries(
    keycaps.reduce<
      Record<string, { label: string; value: number; image: string }[]>
    >((prev, curr) => {
      const keycapGroup = curr.name.split(" ").slice(0, -1).join(" ");

      if (!(keycapGroup in prev)) {
        prev[keycapGroup] = [];
      }

      prev[keycapGroup].push({
        label: curr.name,
        value: curr.id,
        image: curr.image,
      });

      return prev;
    }, {})
  ).map(([key, value]) => ({
    label: key,
    options: value,
  }));

  const countriesOptions = countries.map((country) => ({
    label: country,
    value: country,
  }));

  const citiesOptions = cities?.map((city) => ({
    label: city,
    value: city,
  }));

  function validateKeycap(value: any) {
    let error;
    if (!value) {
      error = "Please select a keycap";
      setSelectedKeycap(undefined);
    } else {
      const keycap = keycaps?.find((keycap) => keycap.id == value.value);

      if (keycap == undefined) {
        error = "Please select a valid keycap";
      } else {
        setSelectedKeycap(keycap);
      }
    }
    return error;
  }

  function validateType(value: any) {
    let error;
    if (!value) {
      error = "Please select the type of listing";
    }
    return error;
  }

  function validateExchange(value: any) {
    let error;
    if (!value) {
      error = "Please select the type of exchange";
    }
    return error;
  }

  function validateCountry(value: any) {
    let error;
    if (value && !countries?.includes(value.value)) {
      error = "Please select a valid country for the listing";
      setSelectedCountry(undefined);
    } else {
      setSelectedCountry(value);
    }
    return error;
  }

  function validateCity(value: any) {
    let error;
    mutate();
    if (value && !cities?.includes(value.value)) {
      error = "Please select a valid city for the listing";
    }
    return error;
  }

  function submitForm<T extends FormData>(
    values: T,
    actions: FormikHelpers<T>
  ) {
    const data: FormData = { ...values };

    console.log(data);

    fetch(`${API_BASE}/api/listing`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        keycap: selectedKeycap?.id?.toString(),
        country: selectedCountry?.value ?? "Unspecified",
        city: data.city?.value ?? "Unspecified",
      }),
      credentials: "include",
    }).then((response) => {
      actions.setSubmitting(false);
      if (response.ok) {
        router.push("/");
        return;
      }

      response.json().then((data) => {
        throw new Error(`Failed to create listing:\n${JSON.stringify(data)}`);
      });
    });
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold">Create keycap listing</h1>
        <Formik<FormData>
          initialValues={{
            keycap: undefined,
            type: undefined,
            exchange: undefined,
          }}
          onSubmit={submitForm<FormData>}
        >
          {(props) => (
            <Form>
              <div className="flex flex-col items-center gap-16">
                <Field name="keycap" validate={validateKeycap}>
                  {({ field, form }: FieldProps) => (
                    <div className="flex flex-col items-center">
                      <label className="text-2xl">Keycap</label>
                      <Select
                        {...field}
                        placeholder="Select keycap"
                        onChange={(value) =>
                          props.setFieldValue("keycap", value)
                        }
                        defaultValue={Object.values(keycapOptions).find(
                          ({ label: _, options }) =>
                            options.find(
                              (keycap) => keycap.value == selectedKeycap?.id
                            )
                        )}
                        options={keycapOptions}
                        formatOptionLabel={(keycap: any) => (
                          <div className="flex flex-col items-center gap-4">
                            <span>{keycap.label}</span>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={keycap.image} alt={keycap.label} />
                          </div>
                        )}
                      />
                      {form.errors.keycap != undefined &&
                        form.touched.keycap != undefined && (
                          <p className="mt-1 text-red-500">
                            {form.errors.keycap?.toString()}
                          </p>
                        )}
                    </div>
                  )}
                </Field>
                <Field name="type" validate={validateType}>
                  {({ field, form }: FieldProps) => (
                    <div className="flex flex-col items-center">
                      <label className="text-2xl">Want/Have</label>
                      {Object.entries(ListingType).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={field.name}
                            value={value}
                            checked={field.value === value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          />
                          {`${value.charAt(0).toUpperCase()}${value
                            .slice(1)
                            .toLowerCase()}`}
                        </label>
                      ))}
                      {form.errors.type != undefined &&
                        form.touched.type != undefined && (
                          <p className="mt-1 text-red-500">
                            {form.errors.type?.toString()}
                          </p>
                        )}
                    </div>
                  )}
                </Field>
                <Field name="exchange" validate={validateExchange}>
                  {({ field, form }: FieldProps) => (
                    <div className="flex flex-col items-center">
                      <label className="text-2xl">Exchange type</label>
                      {Object.entries(ExchangeType).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={field.name}
                            value={value}
                            checked={field.value === value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          />
                          {value === ExchangeType.IRL
                            ? "IRL"
                            : `${value.charAt(0).toUpperCase()}${value
                                .slice(1)
                                .toLowerCase()}`}
                        </label>
                      ))}
                      {form.errors.exchange != undefined &&
                        form.touched.exchange != undefined && (
                          <p className="mt-1 text-red-500">
                            {form.errors.exchange?.toString()}
                          </p>
                        )}
                    </div>
                  )}
                </Field>
                <Field name="country" validate={validateCountry}>
                  {({ field, form }: FieldProps) => (
                    <div className="flex flex-col items-center">
                      <label className="text-2xl">Country</label>
                      <Select
                        {...field}
                        placeholder="Select country"
                        defaultValue={selectedCountry}
                        onChange={(value) =>
                          props.setFieldValue("country", value)
                        }
                        options={countriesOptions}
                      />
                      {form.errors.country != undefined && (
                        <p className="mt-1 text-red-500">
                          {form.errors.country?.toString()}
                        </p>
                      )}
                    </div>
                  )}
                </Field>
                {cities && citiesOptions && (
                  <Field name="city" validate={validateCity}>
                    {({ field, form }: FieldProps) => (
                      <div className="flex flex-col items-center">
                        <label className="text-2xl">Nearest city</label>
                        <Select
                          {...field}
                          placeholder="Select nearest city"
                          defaultValue={form.values.city}
                          onChange={(value) =>
                            props.setFieldValue("city", value)
                          }
                          options={citiesOptions}
                        />
                        {form.errors.city != undefined && (
                          <p className="mt-1 text-red-500">
                            {form.errors.city?.toString()}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>
                )}
                <Button
                  className="mt-4"
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
