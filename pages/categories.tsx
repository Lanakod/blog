import {
  Accordion,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  Skeleton,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { BiCategory } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";

import { queryClient } from "@/pages/_app";
import { useGetCategories, usePostCategory } from "@/queries";
import { GetCategory, PostCategorySchema } from "@/types";
import { CustomNextPage } from "@/types/dts";

const Categories: CustomNextPage = () => {
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  // ACCORDION VALUE/STATE
  const [accordionValue, setAccordionValue] = useState<string | null>(null);

  // SEARCH VALUE & DATA
  const [selectData, setSelectData] = useState<GetCategory["name"][]>([]);
  const [selectValue, setSelectValue] = useState<GetCategory["name"] | null>();
  // FILTERED VALUES
  const [filteredValues, setFilteredValues] = useState<GetCategory[]>();
  // MODAL STATE
  const [createModal, setCreateModal] = useState(false);

  // SET SELECT DATA FOR SEARCH
  useEffect(() => {
    setSelectData([]);
    if (categories) {
      categories.map((ctg) =>
        setSelectData((selectData) => [...selectData, ctg.name])
      );
    }
    setFilteredValues(categories);
  }, [categories]);

  // FILTER THE DATA BY THE SELECTED VALUE
  useEffect(() => {
    if (selectValue) {
      setFilteredValues(categories?.filter((ctg) => ctg.name === selectValue));
    } else {
      setFilteredValues(categories);
    }
  }, [selectValue, categories]);

  // VALIDATE POST CATEGORY FORM
  const createCategoryForm = useForm({
    validate: zodResolver(PostCategorySchema),
    initialValues: {
      name: "",
    },
  });

  const { mutate: postCategory, isLoading: postCategoryLoading } =
    usePostCategory();

  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>
      <main>
        {/*  Title  */}
        <Group align="center" mb="3rem">
          <Title size="1.5rem" weight="500">
            Your Categories
          </Title>
          <ThemeIcon variant="light" color="green" size="md">
            <BiCategory size="25" />
          </ThemeIcon>
        </Group>
        {/*  Search  */}
        <Select
          data={selectData}
          value={selectValue}
          onChange={setSelectValue}
          clearable
          searchable
          nothingFound="No Categories Found"
          icon={<FiSearch />}
          transitionProps={{
            transition: "pop-top-left",
            duration: 80,
            timingFunction: "ease",
          }}
          sx={{ maxWidth: "600px" }}
          mb="1.5rem"
        />
        {/*  NO CATEGORIES  */}
        {categories?.length === 0 && !categoriesLoading && (
          <Box>
            <Group align="center">
              <Text size="lg">No Inventory/Categories</Text>
              <FiSearch size="20" />
            </Group>
          </Box>
        )}

        {/*  ACCORDION FOR THE DATA  */}
        <Skeleton
          mb="3rem"
          visible={categoriesLoading ?? false}
          style={{ minHeight: "80px" }}
          animate
        >
          <Accordion
            value={accordionValue}
            onChange={setAccordionValue}
            transitionDuration={500}
          >
            {filteredValues?.map((category, index) => (
              <Accordion.Item
                value={category.name}
                sx={{ overflowX: "auto" }}
                key={index}
              >
                <Accordion.Control>{category.name}</Accordion.Control>
                <Accordion.Panel
                  sx={{
                    width: "max-content",
                    minWidth: "100%",
                  }}
                >
                  <Table verticalSpacing="md" horizontalSpacing="md">
                    <thead>
                      <tr>
                        <th style={{ paddingLeft: 0 }}>Id</th>
                        <th style={{ paddingLeft: 0 }}>Name</th>
                        <th style={{ paddingLeft: 0 }}>Price</th>
                        <th style={{ paddingLeft: 0 }}>Last Updated</th>
                        <th style={{ paddingLeft: 0 }}>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category?.products?.map((product) => (
                        <tr key={product.name}>
                          {/*ID*/}
                          <td>
                            <div style={{ paddingLeft: "1rem" }}>
                              {product.id}
                            </div>
                          </td>
                          {/*NAME*/}
                          <td>
                            <div style={{ paddingLeft: "1rem" }}>
                              {product.name}
                            </div>
                          </td>
                          {/*PRICE*/}
                          <td>
                            <div style={{ paddingLeft: "1rem" }}>
                              {product.price}
                            </div>
                          </td>
                          {/*LAST UPDATED*/}
                          <td>
                            <div style={{ paddingLeft: "1rem" }}>
                              {product.lastUpdate.toString()}
                            </div>
                          </td>
                          {/*LATEST DATE - STOCK*/}
                          <td>
                            <div style={{ paddingLeft: "1rem" }}>
                              {product?.date[0]?.stock || 0}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {/*  GROUP OF BUTTONS  */}
                  <Group>
                    <Button mt="1.5rem" color="blue">
                      Change Details
                    </Button>
                    <Button mt="1.5rem" color="red">
                      Delete
                    </Button>
                  </Group>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Skeleton>
        {/*  ACTIONS FOR CATEGORIES  */}
        <Box>
          <Button
            color="blue"
            variant="outline"
            onClick={() => setCreateModal(true)}
          >
            Create Category
          </Button>
        </Box>

        {/*  MODALS  */}
        {/*  CREATE CATEGORY  */}
        <Modal
          centered
          opened={createModal}
          onClose={() => setCreateModal(false)}
          title="Create Category"
        >
          <form
            onSubmit={createCategoryForm.onSubmit((values) => {
              postCategory(values, {
                onSuccess: async () => {
                  setCreateModal(false);
                  await queryClient.refetchQueries(["categories"]);
                },
              });
            })}
          >
            <LoadingOverlay
              visible={postCategoryLoading ?? false}
              transitionDuration={500}
            />
            <TextInput
              placeholder="Category name"
              label="Category name"
              withAsterisk
              mb="1rem"
              {...createCategoryForm.getInputProps("name")}
            />
            <Group noWrap={false}>
              <Button type="submit">Create</Button>
              <Button color="red" onClick={() => setCreateModal(false)}>
                Exit
              </Button>
            </Group>
          </form>
        </Modal>
      </main>
    </>
  );
};

export default Categories;
Categories.requireAuth = ["WRITER"];
