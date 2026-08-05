package com.mandalink.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "radicals")
public class Radical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "radical_no")
    private Integer radicalNo;

    @Column(name = "radical_char", nullable = false)
    private String character;

    @Column(nullable = false)
    private String pinyin;

    @Column(nullable = false)
    private String meaning;

    public Radical() {}

    public Radical(Integer radicalNo, String character, String pinyin, String meaning) {
        this.radicalNo = radicalNo;
        this.character = character;
        this.pinyin = pinyin;
        this.meaning = meaning;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getRadicalNo() { return radicalNo; }
    public void setRadicalNo(Integer radicalNo) { this.radicalNo = radicalNo; }

    public String getCharacter() { return character; }
    public void setCharacter(String character) { this.character = character; }

    public String getPinyin() { return pinyin; }
    public void setPinyin(String pinyin) { this.pinyin = pinyin; }

    public String getMeaning() { return meaning; }
    public void setMeaning(String meaning) { this.meaning = meaning; }
}
