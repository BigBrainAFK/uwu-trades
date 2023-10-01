"use client";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Select,
  Image,
  VStack,
  Heading,
  Flex,
  Radio,
} from "@chakra-ui/react";
import { ExchangeType, Keycap, ListingType } from "@prisma/client";
import { Formik, Form, Field, FieldProps, FormikHelpers } from "formik";
import { Loading } from "../../../src/components/Loading";
import { swrFetcher } from "../../../src/util";
import { API_BASE } from "../../../src/const";
import useSWR from "swr";
import { LoadingError } from "../../../src/components/LoadingError";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  keycap: string | undefined;
  type: string | undefined;
  exchange: string | undefined;
  country?: string;
  city?: string;
}

export default function Page() {
  const [selectedKeycap, setSelectedKeycap] = useState<Keycap>();
  const [selectedCountry, setSelectedCountry] = useState<string>();
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
    selectedCountry != undefined && selectedCountry != ""
      ? `/api/country/${selectedCountry}`
      : null,
    swrFetcher
  );

  if (keycapsError || countriesError) return <LoadingError />;
  if (keycaps == undefined || countries == undefined) return <Loading />;

  function validateKeycap(value: any) {
    let error;
    if (!value) {
      error = "Please select a keycap";
      setSelectedKeycap(undefined);
    } else {
      const keycap = keycaps?.find((keycap) => keycap.id == value);

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
    if (value && !countries?.includes(value)) {
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
    if (value && !cities?.includes(value)) {
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

    if (!("country" in data) || data.country == undefined) {
      data.country = "Unspecified";
    }
    if (!("city" in data) || data.city == undefined) {
      data.city = "Unspecified";
    }

    fetch(`${API_BASE}/api/listing`, {
      method: "POST",
      body: JSON.stringify(data),
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
    <Flex flexDirection="column">
      <VStack spacing="2rem">
        <Heading as="h1" size="xl">
          Create keycap listing
        </Heading>
        <Formik
          initialValues={{
            keycap: undefined,
            type: undefined,
            exchange: undefined,
          }}
          onSubmit={submitForm<FormData>}
        >
          {(props) => (
            <Form>
              <VStack spacing="4rem">
                <Field name="keycap" validate={validateKeycap}>
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={
                        form.errors.keycap != undefined &&
                        form.touched.keycap != undefined
                      }
                      alignItems="center"
                      display="flex"
                      flexDirection="column"
                    >
                      <FormLabel fontSize="2xl">Keycap</FormLabel>
                      <Select
                        {...field}
                        placeholder="Select keycap"
                        defaultValue={selectedKeycap?.id}
                      >
                        {keycaps.map((keycap) => {
                          return (
                            <option key={keycap.id} value={keycap.id}>
                              {keycap.name}
                            </option>
                          );
                        })}
                      </Select>
                      {selectedKeycap?.image && (
                        <Image
                          paddingTop="1rem"
                          src={selectedKeycap.image}
                          alt={selectedKeycap.name}
                        />
                      )}
                      <FormErrorMessage>
                        {form.errors.keycap?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="type" validate={validateType}>
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={
                        form.errors.type != undefined &&
                        form.touched.type != undefined
                      }
                      alignItems="center"
                      display="flex"
                      flexDirection="column"
                    >
                      <FormLabel fontSize="2xl">Want/Have</FormLabel>
                      {Object.entries(ListingType).map(([key, value]) => (
                        <Radio
                          key={key}
                          {...field}
                          value={value}
                          isChecked={field.value === value}
                        >
                          {`${value.charAt(0)}${value.slice(1).toLowerCase()}`}
                        </Radio>
                      ))}
                      <FormErrorMessage>
                        {form.errors.type?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="exchange" validate={validateExchange}>
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={
                        form.errors.exchange != undefined &&
                        form.touched.exchange != undefined
                      }
                      alignItems="center"
                      display="flex"
                      flexDirection="column"
                    >
                      <FormLabel fontSize="2xl">Exchange type</FormLabel>
                      {Object.entries(ExchangeType).map(([key, value]) => (
                        <Radio
                          key={key}
                          {...field}
                          value={value}
                          isChecked={field.value === value}
                        >
                          {value != "IRL"
                            ? `${value.charAt(0)}${value
                                .slice(1)
                                .toLocaleLowerCase()}`
                            : value}
                        </Radio>
                      ))}
                      <FormErrorMessage>
                        {form.errors.type?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="country" validate={validateCountry}>
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={form.errors.country != undefined}
                      alignItems="center"
                      display="flex"
                      flexDirection="column"
                    >
                      <FormLabel fontSize="2xl">Country</FormLabel>
                      <Select
                        {...field}
                        placeholder="Select country"
                        defaultValue={selectedCountry}
                      >
                        {countries.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {form.errors.type?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                {cities && (
                  <Field name="city" validate={validateCity}>
                    {({ field, form }: FieldProps) => (
                      <FormControl
                        isInvalid={form.errors.city != undefined}
                        alignItems="center"
                        display="flex"
                        flexDirection="column"
                      >
                        <FormLabel fontSize="2xl">Nearest city</FormLabel>
                        <Select {...field} placeholder="Select nearest city">
                          {cities.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>
                          {form.errors.type?.toString()}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                )}
                <Button
                  mt={4}
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Submit
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </VStack>
    </Flex>
  );
}
