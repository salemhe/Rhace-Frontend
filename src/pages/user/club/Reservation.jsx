"use client";
import ReservationDetails from "@/components/user/club/ReservationDetails";
import { useReservations } from "@/contexts/club/ReservationContext";
import React, { useEffect } from "react";
import ReservationSummary from "../../../components/user/club/ReservationSummary";
import { useLocation, useParams } from "react-router";
import { userService } from "@/services/user.service";
import { clubService } from "@/services/club.service";

function useSearchParams() {
  return new URLSearchParams(useLocation().search);
}

const Reservation = () => {
  const {
    setComboItems,
    setBottleItems,
    setGuestCount,
    setDate,
    table,
    setTable,
    setTime,
    setVendor,
    setLoading,
    setComboLoading,
    setBottlesLoading,
    setTableLoading,
  } = useReservations();
  const { id } = useParams();
  const { page } = useReservations();
  const searchParams = useSearchParams();
  const dates = searchParams.get("date");
  const times = searchParams.get("time");
  const guestss = searchParams.get("guests");
  const tables = searchParams.get("table");
  const searchQuery = {
    date: dates ?? "",
    time: times ?? "",
    guests: guestss ?? "",
    table: tables ?? "",
  }


  const fetchVendor = async () => {
    try {
      setLoading(true);
      const res = await userService.getVendor(id);
      setVendor(res.data);
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCombos = async () => {
    try {
      setComboLoading(true);
      const res = await clubService.getBottleSet(id);
      console.log(res)
      setComboItems(res.bottleSets.map((item) => {
        return { ...item, quantity: 0 }
      }));
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setComboLoading(false);
    }
  };
  const fetchBottles = async () => {
    try {
      setBottlesLoading(true);
      const res = await clubService.getDrinks(id);
      console.log(res)
      setBottleItems(res.drinks.map((item) => {
        return { ...item, quantity: 0 }
      }));
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setBottlesLoading(false);
    }
  };
  const fetchTables = async () => {
    try {
      setTableLoading(true);
      const res = await clubService.getTables(id);
      setTable(res.tables.map((item) => {
        return { ...item, selected: false }
      }));
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
    fetchCombos();
    fetchBottles();
    fetchTables();
    setDate(new Date(searchQuery.date));
    setTime(searchQuery.time);
    setGuestCount(searchQuery.guests);
    setTable(
      table.map((item) => ({
        ...item,
        selected: item._id === searchQuery.table ? !item.selected : false,
      }))
    );
  }, []);

  return <div className="">{page === 1 ? <ReservationSummary id={id} /> : <ReservationDetails id={id} searchQuery={searchQuery} />}</div>;
};

export default Reservation;
