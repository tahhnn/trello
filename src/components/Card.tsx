import { useLocalStorage } from "@/hook/useLocalStorage";
import React, {
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ReactSortable } from "react-sortablejs";
import FormCardUpdate from "./FormCardUpdate";
import CardItem from "./CardItem";
import { StoreContext } from "@/context/StoreContext";

type CardProps = {
  id: string;
  data: Content[];
};

type Content = {
  id: string;
  title: string;
  date: string;
};

type ContentItem = {
  id: string;
  title: string;
  date: string;
};

type Data = {
  [key: number]: {
    titleList: string;
    content: ContentItem[];
  };
};

const Card = ({ id }: CardProps) => {
  const initdata: Content = {
    id: "",
    title: "",
    date: "",
  };
  const { storedValue, setValue, listData } = useContext(StoreContext);

  const inputRef = useRef<HTMLInputElement>(null);
  const [updateContent, setUpdateContent] = useState<Content>(initdata);
  const [isInput, setInput] = useState<Boolean>(false);
  const [dataUpdate, setDataUpdate] = useState("");
  const [date, setDate] = useState("");
  const [list, setList] = useState<Content[]>(storedValue[id].content);

  const handleGetContent = (contentId: string) => {
    return list.find((data) => data.id === contentId);
  };

  const handleInput = () => {
    setInput(true);
    setDataUpdate(updateContent.title);
  };

  const handleClose = () => {
    setInput(false);
  };

  const handleFixCard = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDataUpdate(e.target.value);
  };

  const handleDelete = () => {
    setValue((prev: Data) => {
      const newContent = (prev[id]?.content ?? []).filter(
        (item: Content) => item.id !== updateContent.id
      );
      setList(newContent);
      return {
        ...prev,
        [id]: {
          ...prev[id],
          content: newContent,
        },
      };
    });
  };

  const handleUpdate = (e: SyntheticEvent) => {
    e.preventDefault();
    setValue((prev: Data) => {
      const newContent = (prev[id]?.content ?? []).map((item: Content) => {
        if (item.id === updateContent.id) {
          return {
            ...item,
            title: dataUpdate,
            date: date,
          };
        }
        return item;
      });
      setList(newContent);
      return {
        ...prev,
        [id]: {
          ...prev[id],
          content: newContent,
        },
      };
    });
    setInput(false);
  };

  const handleUpdateSort = useCallback(
    (newData: Content[]) => {
      setValue((prev: Data) => {
        return {
          ...prev,
          [id]: {
            ...prev[id],
            content: newData,
          },
        };
      });
      setList(newData); // Update local state immediately
    },
    [setValue, id]
  );

  useEffect(() => {
    handleUpdateSort(list);
  }, [list, handleUpdateSort]);

  const onChange = (e: any) => {
    setDate(new Date().toLocaleString());
  };

  useEffect(() => {
    if (isInput) {
      inputRef.current?.focus();
    }
  }, [isInput]);

  useEffect(() => {
    const items = document.querySelectorAll(".item");

    const handleClick = (event: Event) => {
      const targetElement = event.currentTarget as HTMLElement;
      const contentId = targetElement.getAttribute("data-id") || "";
      const clickedContent = handleGetContent(contentId);
      if (clickedContent) {
        setUpdateContent(clickedContent);
      }
    };

    items.forEach((item) => {
      item.addEventListener("click", handleClick);
    });

    return () => {
      items.forEach((item) => {
        item.removeEventListener("click", handleClick);
      });
    };
  }, [list]);

  return (
    <ReactSortable
      group={"list"}
      filter=".addImageButtonContainer"
      dragClass="sortableDrag"
      list={list}
      setList={(newList: Content[]) => setList(newList)}
      animation={200}
      easing="ease-out"
    >
      {list.map((item: Content) => (
        <React.Fragment key={item.id}>
          {isInput && item?.id === updateContent?.id ? (
            <FormCardUpdate
              handleUpdate={handleUpdate}
              inputRef={inputRef}
              item={item}
              handleFixCard={handleFixCard}
              onChange={onChange}
              date={date}
              handleDelete={handleDelete}
              handleClose={handleClose}
            />
          ) : (
            <CardItem item={item} handleInput={handleInput} />
          )}
        </React.Fragment>
      ))}
    </ReactSortable>
  );
};

export default Card;
