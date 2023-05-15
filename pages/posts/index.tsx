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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiCategory } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";

import { queryClient } from "@/pages/_app";
import { useGetCategories, usePostCategory } from "@/queries";
import { CreatePostSchema, GetPosts } from "@/types";
import { CustomNextPage } from "@/types/dts";

const PostsPage: CustomNextPage = () => {
  const { data: posts, isLoading: postsLoading } = useGetCategories();
  const router = useRouter();
  // ACCORDION VALUE/STATE
  const [accordionValue, setAccordionValue] = useState<string | null>(null);

  // SEARCH VALUE & DATA
  const [selectData, setSelectData] = useState<GetPosts["title"][]>([]);
  const [selectValue, setSelectValue] = useState<GetPosts["title"] | null>();
  // FILTERED VALUES
  const [filteredValues, setFilteredValues] = useState<GetPosts[]>();
  // MODAL STATE
  const [createModal, setCreateModal] = useState(false);

  // SET SELECT DATA FOR SEARCH
  useEffect(() => {
    setSelectData([]);
    if (posts) {
      posts.map((ctg) =>
        setSelectData((selectData) => [...selectData, ctg.title])
      );
    }
    setFilteredValues(posts);
  }, [posts]);

  // FILTER THE DATA BY THE SELECTED VALUE
  useEffect(() => {
    if (selectValue) {
      setFilteredValues(posts?.filter((ctg) => ctg.title === selectValue));
    } else {
      setFilteredValues(posts);
    }
  }, [selectValue, posts]);

  // VALIDATE POST CATEGORY FORM
  const createPostForm = useForm({
    validate: zodResolver(CreatePostSchema),
    initialValues: {
      title: "",
      content: "",
      categoryId: "",
    },
  });

  const { mutate: postCategory, isLoading: postCategoryLoading } =
    usePostCategory();

  return (
    <>
      <Head>
        <title>Index</title>
      </Head>
      <main>
        {/*  Title  */}
        <Group align="center" mb="3rem">
          <Title size="1.5rem" weight="500">
            Your Posts
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
          nothingFound="No Index Found"
          icon={<FiSearch />}
          transitionProps={{
            transition: "pop-top-left",
            duration: 80,
            timingFunction: "ease",
          }}
          sx={{ maxWidth: "600px" }}
          mb="1.5rem"
        />
        {/*  NO posts  */}
        {posts?.length === 0 && !postsLoading && (
          <Box>
            <Group align="center">
              <Text size="lg">No Inventory/Index</Text>
              <FiSearch size="20" />
            </Group>
          </Box>
        )}

        {/*  ACCORDION FOR THE DATA  */}
        <Skeleton
          mb="3rem"
          visible={postsLoading ?? false}
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
                value={category.title}
                sx={{ overflowX: "auto" }}
                key={index}
              >
                <Accordion.Control>{category.title}</Accordion.Control>
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
                    <tbody></tbody>
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
        {/*  ACTIONS FOR posts  */}
        <Box>
          <Button
            color="blue"
            variant="outline"
            onClick={async () => await router.push("/posts/new")}
          >
            Новый пост
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
            onSubmit={createPostForm.onSubmit((values) => {
              postCategory(values, {
                onSuccess: async () => {
                  setCreateModal(false);
                  await queryClient.refetchQueries(["posts"]);
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
              {...createPostForm.getInputProps("title")}
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

export default PostsPage;
PostsPage.requireAuth = ["WRITER"];
